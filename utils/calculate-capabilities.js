var _ = require('lodash');

module.exports = function calculateCapabilities(data) {
    return new Promise(function(resolve, reject) {
        try {
            var projectTypes = [],
                weeksCapabilities = [],
                capabilities = {},
                weeks = data.weeks,
                employeeIds = _.map(data.sheetReferenceTeam, 'ID'),
                unlock = false;

            _.each(data.weeks[0].projects, function(key, value) {
                var capability = value.replace('Num of ', '');
                projectTypes.push(capability);
                capabilities[capability] = {
                    type: capability,
                    projects: 0,
                    hours: 0,
                    sold: 0
                };
            });

            _.each(data.weeks, function(week) {
                var weekItem = {
                    weekNum: week['Week Num']
                };

                weekItem = _.merge(weekItem, capabilities);
                weeksCapabilities.push(weekItem);
            });

            _.each(data.projectsView, function(project) {
                unlock = true;
            
                if (project.employees.length) {
                    (function(project) {
                        var type = project.type,
                            capability;

                        _.each(project.employees, function(employee) {
                            (function(employee, type) {
                                _.each(data.weeks, function(week) {
                                    var weekHours = parseInt(employee[week['Week Num']]),
                                        resource = _.find(data.sheetReferenceTeam, { Role: employee.role }),
                                        weekCapability;

                                    if (weekHours > 0) {
                                        weekCapability = _.find(weeksCapabilities, { weekNum: week['Week Num'] });
                                        capability = weekCapability[type];
                                        capability.hours += parseInt(resource['Available hours'], 10);
                                        capability.sold += parseInt(resource['Available hours'], 10) * parseInt(resource['Rate'], 10);

                                        if (unlock) {
                                            capability.projects++;
                                        }
                                    }
                                });
                            })(employee, type);
                            unlock = false;
                        });
                    })(project);
                }

                unlock = false;
            });

            return calculateCapabilitiesByYear(data).then(function(data) {
                data.capabilities = weeksCapabilities;
                resolve(data);
            });
        } catch (err) {
            reject(err);
        }
    });
}

function calculateCapabilitiesByYear(data) {
    return new Promise(function(resolve, reject) {
        try {
            var projectTypes = [],
                capabilities = [],
                employeeIds = _.map(data.sheetReferenceTeam, 'ID');

            _.each(data.weeks[0].projects, function(key, value) {
                projectTypes.push(value.replace('Num of ', ''));
            });

            _.each(projectTypes, function(type) {
                var projects = _.filter(data.sheetInputProjects, function(project) {
                    return project['Type'] === type;
                }), hours = sold = 0;

                _.each(projects, function(project) {
                    (function(project) {
                        _.each(employeeIds, function(employeeId) {
                            var resourceQty = parseInt(project[employeeId], 10),
                                resource, numOfWeeks, numOfWeeksInteger;

                            if (project['Start'] && resourceQty) {
                                numOfWeeks = project['Num of weeks'];
                                numOfWeeksInteger = parseInt(numOfWeeks, 10);
                                resource = _.find(data.sheetReferenceTeam, { ID: employeeId });

                                if (numOfWeeks) {
                                    hours += parseInt(resource['Available hours'], 10) * numOfWeeksInteger;
                                    sold += (parseInt(resource['Available hours'], 10) * numOfWeeksInteger) * parseInt(resource['Rate'], 10);
                                }
                            }
                        });
                    })(project);
                });

                capabilities.push({
                    type: type,
                    projects: projects.length,
                    hours: hours,
                    sold: sold
                });
            });

            data.capabilitiesByYear = capabilities;
            
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}