var google = require('googleapis');

module.exports = function fetchData(auth, spreadsheetId, range, callback) {
    var sheets = google.sheets('v4');

    return new Promise(function(resolve, reject) {
        try {
            sheets.spreadsheets.values.get({
                auth: auth,
                spreadsheetId: spreadsheetId,
                range: range,
            }, function(err, response) {
                var rows;

                if (err) {
                    console.log('The API returned an error: ' + err);
                    reject(err);
                    return;
                }

                rows = response.values;

                if (rows.length == 0) {
                    console.log('No data found.');
                    reject('No data found.');
                } else {
                    resolve(callback(rows));
                }
            });
        } catch (err) {
            reject(err);
        }
    });
};