var getAuth = require('./auth.js'),
    input = require('./services/input'),
    output = require('./services/output-2017-planned'),
    utils = require('./utils/index');

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
                return calculateAndFillTeamAllocation(data, auth);
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

function calculateAndFillTeamAllocation(data, auth) {
    return utils.calculateResourcesAllocation(data)
        .then(utils.buildTeamAllocationOutput)
        .then(function(data) {
            return output.fillTeamAllocation(auth, data);
        });
}