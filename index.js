var auth = require('./auth.js'),
    input = require('./services/input'),
    output = require('./services/output-2017-planned'),
    utils = require('./utils/index');


// auth
//  get inputs
//      calculate reference
//          fill reference weeks
//      calculate input
//          fill input weeks
//          calculate dates
//              fill dates input
//  calculate projects
//      calculate team matrix
//          projects
//          career
//          experience
//      build matrix
//      fill projects sheet

auth()
    .then(function(auth) {
        Promise.all([
                input.getReferenceTeamHealth(auth),
                input.getReferenceTeam(auth),
                input.getReferenceProjects(auth),
                input.getInputProjects(auth),
                input.getReferenceWeeks(auth)
            ])
            .then(utils.buildWeeksArray)
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
            })
            .then(function(data) {
                return utils.calculateProjects(auth, input, data);
            })
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
    });