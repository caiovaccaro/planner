var _ = require('lodash');

module.exports = function buildFinanceOutput(data) {
    try {
        var financeMatrix = [];

        _.each(data.finance, function(week) {
            var row = [];

            for (var prop in week) {
                row.push(week[prop]);
            }

            financeMatrix.push(row);
        });

        data.financeMatrix = financeMatrix;

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(err);
    }
}