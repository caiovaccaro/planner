var spreadsheetId = '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
    range = '2017 Reference Team Data!A1:AC54',
    fetchData = require('../utils/fetchData');

module.exports = function (auth) {
    return fetchData(auth, spreadsheetId, range, function(rows) {
        return getRawData(rows);
    });
};

// TODO: Check why this getRawData has to be different from utils/getRawData
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