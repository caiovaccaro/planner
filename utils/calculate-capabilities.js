var _ = require('lodash');

module.exports = function calculateCapabilities(data) {
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

            data.capabilities = capabilities;
            
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}