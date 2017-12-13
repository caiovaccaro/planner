var google = require('googleapis'),
    spreadsheetId = '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
    range = '2017 Reference Team Health Data!Q1:Y2',
    data = [];

module.exports = function (auth) {
  return fetchData(auth, function(rows) {
      return getRawData(rows);
  });
}

function fetchData(auth, callback) {
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
}

function getRawData(rows) {
    return new Promise(function(resolve, reject) { 
        var i, row, j, k;

        try {
            for (i = 0; i < rows.length; i++) {
                row = rows[i];

                if (i === 0) {
                    for (j = 0; j < row.length; j++) {
                        data[j] = {
                            name: row[j],
                            data: ""
                        };
                    }
                } else {
                    for (k = 0; k < row.length; k++) {
                        if (data[k]) {
                            data[k].data = row[k];
                        }
                    }
                }
            }
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}