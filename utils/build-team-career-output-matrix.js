var _ = require('lodash'),
    moment = require('moment'),
    math = require('mathjs');

/**
 * For each week
 *  get each type of resource
 *      and multiply its number by each level score
 *      add to the respective A,M,S,L,TA under execution or leadership
 *      calculate the median of A,M,S,L,TA by execution and leadership
 */
module.exports = function buildTeamCareerOutputMatrix(data) {
    try {
        var weeks = data.weeks,
            i = j = k = l = 0,
            length = weeks.length,
            row, prop, resource, resourceQty, resourceType,
            teamCareerMatrix = [];

        for (i; i < length; i++) {
            week = weeks[i];

            row = [];

            row[0] = 0;
            row[1] = 0;
            row[2] = 0;
            row[3] = 0;
            row[4] = 0;

            var medianA = [],
                medianM = [],
                medianS = [],
                medianL = [],
                medianTA = [];

            for (prop in week.team) {
                resourceQty = week.team[prop];

                if (resourceQty > 0) {
                    resource = _.find(data.sheetReferenceTeam, { ID: prop });
                    resourceType = resource['Type'];

                    if (resourceType === 'L' || resourceType === 'TA') {
                        for (j; j < resourceQty; j++) {
                            medianL.push(parseFloat(resource['L Score']));
                        }
                        for (k; k < resourceQty; k++) {
                            medianTA.push(parseFloat(resource['TA Score']));
                        }
                    } else if (resourceType) {
                        for (j; j < resourceQty; j++) {
                            medianA.push(parseFloat(resource['A Score']));
                        }
                        for (k; k < resourceQty; k++) {
                            medianM.push(parseFloat(resource['M Score']));
                        }
                        for (l; l < resourceQty; l++) {
                            medianS.push(parseFloat(resource['S Score']));
                        }
                    }
                }
            }

            row[0] = medianA.length ? math.median(medianA) : 0;
            row[1] = medianM.length ? math.median(medianM) : 0;
            row[2] = medianS.length ? math.median(medianS) : 0;
            row[3] = medianL.length ? math.median(medianL) : 0;
            row[4] = medianTA.length ? math.median(medianTA) : 0;

            teamCareerMatrix.push(row);
        }

        data.teamCareerMatrix = teamCareerMatrix;

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(err);
    }
}