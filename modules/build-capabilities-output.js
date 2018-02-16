var _ = require('lodash');

module.exports = function buildCapabilitiesOutput(data) {
    try {
        var capabilitiesOutput = [];

        _.each(data.capabilities, function(capability) {
            var weekNum = capability.weekNum,
                prop;

            for (prop in capability) {
                if (typeof capability[prop] === 'object') {
                    capabilitiesOutput.push([weekNum, capability[prop].type, capability[prop].projects, capability[prop].hours, capability[prop].sold]);
                }
            }
        });

        return new Promise(function(resolve, reject) {
            buildCapabilitiesOutputByYear(data).then(function(data) {
                data.capabilitiesOutput = capabilitiesOutput
                resolve(data);
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
}

function buildCapabilitiesOutputByYear(data) {
    try {
        var capabilitiesOutput = [];

        _.each(data.capabilitiesByYear, function(capability) {
            var row = [],
                prop;

            for (prop in capability) {
                row.push(capability[prop]);
            }

            capabilitiesOutput.push(row);
        });
        
        data.capabilitiesOutputYear = capabilitiesOutput;

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(err);
    }
}