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
module.exports = function buildTeamAllocationOutput(data) {
    try {
        var teamAllocationMatrix = [];

        _.each(data.teamAllocation, function(member) {
            var row = [],
                prop;

            for (prop in member) {
                row.push(member[prop]);
            }

            teamAllocationMatrix.push(row);
        });

        data.teamAllocationMatrix = teamAllocationMatrix;

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(err);
    }
}