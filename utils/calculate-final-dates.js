module.exports = function calculateFinalDates(data) {
    return new Promise(function(resolve, reject) {
        auth()
            .then(getInputProjects)
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
                
                resolve(datesColumn);
            });
        });
}