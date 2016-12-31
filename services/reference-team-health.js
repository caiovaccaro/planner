var google = require('googleapis');
var spreadsheetId = '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q';
var range = '2017 Reference Team Health Data!Q1:Y2';
var data = [];

module.exports = function (auth) {
  return fetchData(auth, function(rows) {
      return getRawData(rows);
  });
}

function fetchData(auth, callback) {
    var sheets = google.sheets('v4');

    return new Promise(function(resolve, reject) {
        sheets.spreadsheets.values.get({
            auth: auth,
            spreadsheetId: spreadsheetId,
            range: range,
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            }

            var rows = response.values;

            if (rows.length == 0) {
                console.log('No data found.');
                reject('No data found.');
            } else {
                resolve(callback(rows));
            }
        });
    });
}

function getRawData(rows) {
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];

            if (i === 0) {
                for (var j = 0; j < row.length; j++) {
                    data[j] = {
                        name: row[j],
                        data: ""
                    };
                }
            } else {
                for (var k = 0; k < row.length; k++) {
                    if (data[k]) {
                        data[k].data = row[k];
                    }
                }
            }
        }
        resolve(data);
    });
}