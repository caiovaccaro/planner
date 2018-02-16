var _ = require('lodash'),
    getAuth = require('../auth.js'),
    moment = require('moment'),
    math = require('mathjs'),
    input = require('../services/input');

/**
 * See which and how many projects on that week
 * Get the team for each, sum
 * Fill team and projects for each week
 * 
 * For each project
 *  get the start date and the num of weeks
 *  for each week
 *      push the team and project data
 **/
module.exports = function calculateProjects(auth, data) {
    var weeks = data.weeks;

    return new Promise(function(resolve, reject) {
        try {
            getAuth()
                .then(input.getInputProjects)
                .then(function(response) {
                    data.sheetInputProjects = response;

                    _.each(response, function(project) {
                        if (project['Start']) {
                            var projectStart = project['Start'],
                                startWeek = moment(projectStart).week(),
                                numOfWeeks = project['Num of weeks'],
                                numOfWeeksInteger = parseInt(numOfWeeks, 10),
                                i = 0,
                                index, week;

                            if (numOfWeeks) {
                                for(i; i < numOfWeeksInteger; i++) {
                                    if (moment(projectStart).add(i, 'weeks').year() < 2018) {
                                        index = startWeek + i - 1;
                                        week = weeks[index];

                                        (function(week, project) {
                                            week.projects['Num of ' + project['Type']] += 1;
                                            _.each(week.team, function(value, key) {
                                                week.team[key] += parseInt(project[key], 10);
                                            });
                                        })(week, project);
                                    }
                                }
                            }
                        }
                    });

                    resolve({
                        sheetReferenceTeamHealth: data.sheetReferenceTeamHealth,
                        sheetReferenceTeam: data.sheetReferenceTeam,
                        sheetReferenceProjects: data.sheetReferenceProjects,
                        sheetInputProjects: data.sheetInputProjects,
                        sheetReferenceWeeks: data.sheetReferenceWeeks,
                        weeks: weeks,
                        weeksReference: data.weeksReference,
                        weeksInput: data.weeksInput,
                        team: data.team
                    });
                });
        } catch (err) {
            reject(err);
        }
    })
}