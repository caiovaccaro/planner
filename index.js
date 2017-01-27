var getAuth = require('./auth.js'),
    input = require('./services/input'),
    output = require('./services/output-2017-planned'),
    utils = require('./utils/index'),
    _ = require('lodash'),
    faker = require('faker/locale/pt_BR');

getAuth()
    .then(function(auth) {
        Promise.all(input.getInputs(auth))
            .then(function(data) {
                return calculateAndFillReferenceAndInput(data, auth);
            })
            .then(function(data) {
                return calculateAndFillProjects(data, auth);
            })
            .then(function(data) {
                return calculateResourcesAllocation(data);
            });
    }).catch(function(err) {
        console.log(err);
    });

process.on('unhandledRejection', function(reason) {
  console.log(reason);
});

/**
 * With all reference and input data:
 *  build a weeks array as database,
 *  calculate the estimate weeks of the projects reference sheet,
 *  then calculate the estimate weeks of the projects input sheet,
 *  fill those data into the spreadsheet.
 */
function calculateAndFillReferenceAndInput(data, auth) {
    return utils.buildWeeksArray(data)
        .then(utils.calculateReferenceWeeks)
        .then(utils.calculateInputWeeks)
        .then(function(data) {
            return output.fillWeeksReference(data, auth);
        })
        .then(function(data) {
            return output.fillWeeksInput(data, auth);
        })
        .then(utils.calculateFinalDates)
        .then(function(data) {
            return output.fillWeeksDatesInput(data, auth);
        });
}

/**
 * With the sheet references updated:
 *  build array matrices as google sheets require for:
 *      team allocation,
 *      team career scores,
 *      team experience scores,
 *  and fill the planned sheet with projects and team data.
 */
function calculateAndFillProjects(data, auth) {
    return utils.calculateProjects(auth, data)
        .then(utils.buildProjectsTeamOutputMatrix)
        .then(utils.buildProjectsOutputMatrix)
        .then(utils.buildTeamCareerOutputMatrix)
        .then(utils.buildTeamExperienceOutputMatrix)
        .then(function(data) {
            return output.fillTeamOutput(auth, data);
        })
        .then(function(data) {
            return output.fillProjectsOutput(auth, data);
        })
        .then(function(data) {
            return output.fillTeamScoreOutput(auth, data);
        })
        .then(function(data) {
            return output.fillTeamExperienceOutput(auth, data);
        });
}


/**
 * {
 *  Role: string
 *  Type: string
 *  Level: string
 *  Available hours: int
 *  Week 01: int (hours)
 *  ...
 * }
 * 
 * For each week
 *  for each team member
 *      fill his object
 *      fill the current week
 */
function calculateResourcesAllocation(data) {
    // console.log(JSON.stringify(data.weeks, null, 2));
    var teamMembers = [];

    try {
        var weeks = data.weeks,
            length = weeks.length,
            i = k = l = 0,
            n = 1;

        for (i; i < length; i++) {
            week = weeks[i];

            (function(week) {
                var prop, resourceQty;

                for (prop in week.team) {
                    resourceQty = week.team[prop];

                    if (resourceQty > 0) {
                        (function(resourceQty, prop, week) {
                            var j = 0;

                            for (j; j < resourceQty; j++) {
                                (function() {
                                    var member, weekNum,
                                        resource = _.find(data.sheetReferenceTeam, { ID: prop }),
                                        weekNum = week['Week Num'],
                                        existingMember = _.filter(teamMembers, function(member) {
                                            return member.role === resource['Role'] && (!member[weekNum] || member[weekNum] < 40)
                                        });

                                    member = existingMember.length ? existingMember[0] : {
                                        id: n,
                                        name: faker.name.findName(),
                                        role: resource['Role'],
                                        type: resource['Type'],
                                        level: resource['Level'],
                                        availableHours: resource['Available hours']
                                    };

                                    if (!existingMember.length) n++;

                                    member[weekNum] = member[weekNum] ? parseInt(member[weekNum], 10) + parseInt(member.availableHours, 10) : parseInt(member.availableHours, 10);
                                    teamMembers.push(member);
                                })();
                            }
                        })(resourceQty, prop, week);
                    }
                    // fill weeks without hours with 0
                }
            })(week);
        }

        for (k; k < length; k++) {
            week = weeks[k];

            (function(week, l) {
                for (l; l < teamMembers.length; l++) {
                    if (!teamMembers[l][week['Week Num']]) {
                        teamMembers[l][week['Week Num']] = 0;
                    }
                }
            })(week, l);
        }

        console.log(JSON.stringify(teamMembers, null, 2));
        // data.teamCareerMatrix = teamCareerMatrix;

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(err);
    }
}