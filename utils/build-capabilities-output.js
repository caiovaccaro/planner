var _ = require('lodash');

module.exports = function buildCapabilitiesOutput(data) {
    try {
        var capabilitiesOutput = [];

        _.each(data.capabilities, function(capability) {
            var row = [],
                prop;

            for (prop in capability) {
                row.push(capability[prop]);
            }

            capabilitiesOutput.push(row);
        });
        
        data.capabilitiesOutput = capabilitiesOutput;

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(err);
    }
}