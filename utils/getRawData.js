var google = require('googleapis');

module.exports = function getRawData(rows) {
    return new Promise(function(resolve, reject) {
        var first, headers, jsonData, i,
            length, myRow, row, data, x;

        try {
            first = rows[0].join()
            headers = first.split(',');
            jsonData = [];

            for (i = 1, length = rows.length; i < length; i++) {
                myRow = rows[i].join();
                row = myRow.split(',');
                data = {};

                for (x = 0; x < row.length; x++) {
                    data[headers[x]] = row[x];
                }
                jsonData.push(data);
            }

            resolve(jsonData);
        } catch (err) {
            reject(err);
        }
    });
};