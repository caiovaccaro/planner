var _ = require('lodash'),
    moment = require('moment'),
    math = require('mathjs');

/**
 * Build weeks "database"
 * like:
 *  weeks [
 *      {
 *          weekNumber:
 *          weekDate:
 *          team: { TD, DoE, TA... }
 *          projects: { Num of... }
 *      }
 *  ]
 */
module.exports = function buildWeeksArray(data, weeks) {
    var team = _.map(data[1], 'ID'),
        projectTypes = _.filter(_.uniq(_.map(data[2], 'Project Type')), function(type) {
        return type.length;
    }), weeks;

    _.each(data[4], function(week) {
        week.team = {};
        week.projects = {};
        _.each(team, function(id) {
            week.team[id] = 0;
        });
        _.each(projectTypes, function(type) {
            week.projects['Num of ' + type] = 0;
        })

        weeks.push(week);
    });

    return Promise.resolve({
        sheetReferenceTeamHealth: data[0],
        sheetReferenceTeam: data[1],
        sheetReferenceProjects: data[2],
        sheetInputProjects: data[3],
        sheetReferenceWeeks: data[4],
        weeks: weeks,
        team: team
    });
}