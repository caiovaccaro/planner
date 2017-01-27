var _ = require('lodash'),
    getAuth = require('../auth.js'),
    moment = require('moment'),
    math = require('mathjs'),
    input = require('../services/input');

module.exports = function calculateFinalDates(referenceData) {
    return new Promise(function(resolve, reject) {
        try {
            getAuth()
                .then(input.getInputProjects)
                .then(function(data) {
                    var datesColumn = [],
                        i = 0,
                        length = data.length,
                        project, date;

                    for(i; i < length; i++) {
                        project = data[i];
                        date = [];
                        
                        date[0] = moment(project['Start']).add(parseInt(project['Num of weeks'], 10), 'weeks').format('l');
                        datesColumn.push(date);
                    };
                    
                    resolve([datesColumn, referenceData]);
                });
        } catch (err) {
            return reject(err);
        }
    });
}