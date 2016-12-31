var google = require('googleapis');
var auth = require('./auth.js');
var _ = require('lodash');
var moment = require('moment');
var referenceTeamHealth = require('./services/reference-team-health');
var referenceProjects = require('./services/reference-projects');
var referenceTeam = require('./services/reference-team');
var referenceWeeks = require('./services/reference-weeks');
var inputProjects = require('./services/input-2017-projects');
var weeks = [];

auth()
    .then(function(auth) {
        Promise.all([
                referenceTeamHealth(auth),
                referenceTeam(auth),
                referenceProjects(auth),
                inputProjects(auth),
                referenceWeeks(auth)
            ])
            .then(buildWeeksArray)
            .then(calculateReferenceWeeks)
            .then(calculateInputWeeks)
            .then(function(data) {
                return fillWeeksReference(data, auth);
            })
            .then(function(data) {
                return fillWeeksInput(data, auth);
            })
            .then(calculateProjects);
    });

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
function buildWeeksArray(data) {
    var team = _.map(data[1], 'ID');
    var projectTypes = _.filter(_.uniq(_.map(data[2], 'Project Type')), function(type) {
        return type.length;
    });

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

    return Promise.resolve(data);
}

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
function calculateProjects() {
    return new Promise(function(resolve, reject) {
        auth()
            .then(inputProjects)
            .then(function(data) {
                _.each(data, function(project) {
                    if (project['Start']) {
                        var startWeek = moment(project['Start']).week();
                        
                        weeks[startWeek].projects['Num of ' + project['Type']] += 1;

                        for(var i = startWeek + 1; i <= project['Num of weeks']; i++) {
                            weeks[i].projects['Num of ' + project['Type']] += 1;
                            _.each(weeks[i].team, function(value, key) {
                                weeks[i].team[key] += parseInt(project[key], 10);
                            });
                        }
                    }
                });
                resolve(weeks);
            });
    })
}

function calculateReferenceWeeks(data) {
    return new Promise(function(resolve, reject) {
        var ids = _.map(data[1], 'ID');
        var weeksColumn = [];
        
        for(var i = 1; i < data[2].length; i++) {
            var project = data[2][i],
                weeks = [],
                teamSum;

            teamSum = _.reduce(ids, function(sum, id) {
                var resource = _.find(data[1], { ID: id });
                var resourceQty = project[id] || 0;
                var op = resource['P. Operator'] === '*' ? 
                            parseInt(resourceQty, 10) * parseFloat(resource['P. Factor']) :
                            parseInt(resourceQty, 10) / parseFloat(resource['P. Factor']);

                return sum + op;
            }, 0);

            weeks[0] = Math.ceil(teamSum > 0 ? (project['Num of templates'] / teamSum) * project['Complexity'] : 0);
            weeksColumn.push(weeks);
        };
        resolve([data, weeksColumn]);
    });
}

function calculateInputWeeks(data) {
    return new Promise(function(resolve, reject) {
        var ids = _.map(data[0][1], 'ID');
        var weeksColumn = [];

        for(var i = 1; i < data[0][3].length; i++) {
            var project = data[0][3][i],
                weeks = [],
                teamSum;

            teamSum = _.reduce(ids, function(sum, id) {
                var resource = _.find(data[0][1], { ID: id });
                var resourceQty = project[id] || 0;
                var op = resource['P. Operator'] === '*' ? 
                            parseInt(resourceQty, 10) * parseFloat(resource['P. Factor']) :
                            parseInt(resourceQty, 10) / parseFloat(resource['P. Factor']);

                return sum + op;
            }, 0);

            weeks[0] = Math.ceil(teamSum > 0 ? (project['Num of templates'] / teamSum) * project['Complexity'] : 0);
            weeksColumn.push(weeks);
        };
        
        resolve({ weeksReference: data[1], weeksInput: weeksColumn });
    });
}

function fillWeeksReference(data, auth) {
    var sheets = google.sheets('v4');

    return new Promise(function(resolve, reject) {        
        sheets.spreadsheets.values.update({
            auth: auth,
            spreadsheetId: '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
            range: '2017 Reference Projects Forecast Data!K3:K111',
            valueInputOption: 'RAW',
            resource: {
                values: data.weeksReference
            }
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            } else {
                resolve(data);
            }
        });
    });
}

function fillWeeksInput(data, auth) {
    var sheets = google.sheets('v4');

    return new Promise(function(resolve, reject) {        
        sheets.spreadsheets.values.update({
            auth: auth,
            spreadsheetId: '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
            range: '2017 Planned Projects Input!M3:M13',
            valueInputOption: 'RAW',
            resource: {
                values: data.weeksInput
            }
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            } else {
                resolve();
            }
        });
    });
}