var spreadsheetId = '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
    range = '2017 Reference Team Health Data!Q1:Y2',
    fetchData = require('../utils/fetchData');

module.exports = function (auth) {
    return fetchData(auth, spreadsheetId, range, function(rows) {
        return getRawData(rows);
    });
};

// TODO: Check why this getRawData has to be different from utils/getRawData
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