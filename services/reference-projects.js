var spreadsheetId = '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
    range = '2017 Reference Projects Forecast Data!A1:BK111',
    fetchData = require('../utils/fetchData'),
    getRawData = require('../utils/getRawData');

module.exports = function (auth) {
    return fetchData(auth, spreadsheetId, range, function(rows) {
        return getRawData(rows);
    });
};