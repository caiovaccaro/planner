var _ = require('lodash'),
    moment = require('moment'),
    math = require('mathjs');

module.exports = function buildProjectsOutputMatrix(data) {
    var projectsMatrix = [];

    _.each(data.weeks, function(week) {
        var row = [];

        _.each(week.projects, function(value, key) {
            row.push(value);
        })

        projectsMatrix.push(row);
    });

    data.projectsMatrix = projectsMatrix;

    return Promise.resolve(data);
}