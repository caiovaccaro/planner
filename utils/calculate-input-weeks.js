var _ = require('lodash'),
    moment = require('moment'),
    math = require('mathjs');

module.exports = function calculateInputWeeks(data) {
    return new Promise(function(resolve, reject) {
        try {
            var ids = _.map(data.sheetReferenceTeam, 'ID'),
                weeksColumn = [],
                i = 0,
                length = data.sheetInputProjects.length,
                teamSum, weeks;

            for(i; i < length; i++) {
                project = data.sheetInputProjects[i];
                weeks = [];

                teamSum = _.reduce(ids, function(sum, id) {
                    var resource = _.find(data.sheetReferenceTeam, { ID: id }),
                        resourceQty = project[id] > 0 ? project[id] : 0,
                        op = resource['P. Operator'] === '*' ? 
                                parseInt(resourceQty, 10) * parseFloat(resource['P. Factor']) :
                                parseInt(resourceQty, 10) / parseFloat(resource['P. Factor']);
                    
                    return sum + op;
                }, 0);

                weeks[0] = Math.ceil(teamSum > 0 ? (project['Num of templates'] / teamSum) * project['Complexity'] : 0);
                weeksColumn.push(weeks);
            };
            
            resolve({
                sheetReferenceTeamHealth: data.sheetReferenceTeamHealth,
                sheetReferenceTeam: data.sheetReferenceTeam,
                sheetReferenceProjects: data.sheetReferenceProjects,
                sheetInputProjects: data.sheetInputProjects,
                sheetReferenceWeeks: data.sheetReferenceWeeks,
                weeks: data.weeks,
                weeksReference: data.weeksReference,
                weeksInput: weeksColumn,
                team: data.team
            });
        } catch (err) {
            reject(err);
        }
    });
}