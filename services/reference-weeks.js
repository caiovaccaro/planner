var google = require('googleapis'),
    spreadsheetId = '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
    range = '2017 Planned Output!A2:B54',
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
}