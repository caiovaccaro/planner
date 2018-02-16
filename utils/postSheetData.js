var google = require('googleapis');

module.exports = function postSheetData(auth, data, spreadsheetId, range, valueInputOption, result) {
    var sheets = google.sheets('v4');

    return new Promise(function(resolve, reject) {
        finalData = result || data;

        try {
            sheets.spreadsheets.values.update({
                auth: auth,
                spreadsheetId: spreadsheetId,
                range: range,
                valueInputOption: valueInputOption,
                resource: {
                    values: data.financeMatrix
                }
            }, function(err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    reject(err);
                    return;
                } else {
                    resolve(finalData);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
};