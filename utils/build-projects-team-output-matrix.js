var _ = require('lodash'),
    moment = require('moment'),
    math = require('mathjs');

module.exports = function buildProjectsTeamOutputMatrix(data) {
    var teamMatrix = [];

    _.each(data.weeks, function(week) {
        var row = [];

        _.each(week.team, function(value, key) {
            row.push(value);
        })

        teamMatrix.push(row);
    });
    
    data.teamMatrix = teamMatrix;

    return Promise.resolve(data);
}