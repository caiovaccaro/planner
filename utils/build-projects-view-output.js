var _ = require('lodash');

module.exports = function buildProjectsViewOutput(data) {
    try {
        var projectsViewMatrix = [],
            weeksArr = [];

        data.weeks.map(function(week) {
            weeksArr.push(week['Week Num']);
        });

        _.each(data.projectsView, function(project) {
            var row = [];

            row[0] = 'Project: ' + project.name;
            row[1] = ' ';
            row[2] = 'Start:';
            row[3] = project.start;
            row[4] = 'End:';
            row[5] = project.end;
            row[6] = 'Weeks:';
            row[7] = project.weeks;
            row[8] = 'Integration:';
            row[9] = project.integration;
            row[10] = 'Back-end:';
            row[11] = project.backend;
            row[12] = 'QA:';
            row[13] = project.qa;
            row[14] = 'Deploy:';
            row[15] = project.deploy;
            row[16] = 'Architecture:';
            row[17] = project.architecture;
            row[18] = 'Infrastructure:';
            row[19] = project.infrastructure;

            projectsViewMatrix.push(row);
            projectsViewMatrix.push(_.concat(['Employees'], weeksArr));

            (function(project, projectsViewMatrix) {
                _.each(project.employees, function(employee) {
                    var newRow = [];
                    
                    newRow[0] = employee.role + ' ' + employee.type + ' ' + employee.level;

                    (function(newRow, employee, projectsViewMatrix) {
                        _.each(weeksArr, function(week) {
                            newRow.push(employee[week]);
                        });

                        projectsViewMatrix.push(newRow);
                    })(newRow, employee, projectsViewMatrix);
                });

                projectsViewMatrix.push([]);
            })(project, projectsViewMatrix);
        });
        
        data.projectsViewMatrix = projectsViewMatrix;

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(err);
    }
}