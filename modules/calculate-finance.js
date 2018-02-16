var _ = require('lodash');

module.exports = function calculateFinance(data) {
    try {
        var weeks = [];
    
        _.each(data[1].capabilities, function(week) {
            var obj = {
                weekNum: week.weekNum,
                hours: 0,
                sold: 0
            };

            for (var capability in week) {
                if (capability !== 'weekNum') {
                    obj.hours += week[capability].hours;
                    obj.sold += week[capability].sold;
                }
            }

            weeks.push(obj);
        });

        data[1].finance = weeks;

        return Promise.resolve(data[1]);
    } catch (err) {
        return Promise.reject(err);
    }
}