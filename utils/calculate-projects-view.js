var _ = require('lodash'),
    moment = require('moment');

module.exports = function calculateProjectsView(data) {
    return new Promise(function(resolve, reject) {
        try {
            var projects = [],
                employeeIds = _.map(data.sheetReferenceTeam, 'ID'),
                weeks = data.weeks,
                weeksObj = {};

            weeks.map(function(week) {
                weeksObj[week['Week Num']] = 0;
            });

            _.each(data.sheetInputProjects, function(project) {
                var outputProject = {
                    name: project['Project Name'],
                    start: project['Start'],
                    end: project['End'],
                    weeks: project['Num of weeks'],
                    type: project['Type'],
                    integration: project['Integration'],
                    backend: project['Back-end'],
                    qa: project['QA'],
                    deploy: project['Deploy'],
                    architecture: project['Architecture'],
                    infrastructure: project['Infrastructure'],
                    employees: []
                };

                (function(project, outputProject) {
                    _.each(employeeIds, function(employeeId) {
                        var resourceQty = parseInt(project[employeeId], 10),
                            resource, projectStart, startWeek, numOfWeeks, numOfWeeksInteger, j, week,
                            resourceObj = {},
                            i = 0;

                        if (resourceQty > 0) {
                            resource = _.find(data.sheetReferenceTeam, { ID: employeeId });

                            for(i; i < resourceQty; i++) {
                                resourceObj = {
                                    role: resource['Role'],
                                    type: resource['Type'],
                                    level: resource['Level']
                                };
                                _.merge(resourceObj, weeksObj);
                                outputProject.employees.push(resourceObj);
                            }

                            if (project['Start']) {
                                projectStart = project['Start'];
                                startWeek = moment(projectStart).week();
                                numOfWeeks = project['Num of weeks'];
                                numOfWeeksInteger = parseInt(numOfWeeks, 10);
                                j = 0;

                                if (numOfWeeks) {
                                    for(j; j < numOfWeeksInteger; j++) {
                                        if (moment(projectStart).add(j, 'weeks').year() < 2018) {
                                            index = startWeek + j - 1;
                                            week = weeks[index];

                                            (function(outputProject, week) {
                                                _.each(outputProject.employees, function(employee) {
                                                    var resource = _.find(data.sheetReferenceTeam, { Role: employee.role });
                                                    employee[week['Week Num']] = resource['Available hours'];
                                                });
                                            })(outputProject, week);
                                        }
                                    }
                                }
                            }
                        }
                    });
                })(project, outputProject);

                projects.push(outputProject);
            });

            data.projectsView = projects;
            
            resolve(data);
        } catch (err) {
            reject(err);
        }
    })
}