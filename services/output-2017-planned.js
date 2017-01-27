var google = require('googleapis'),
    auth = require('./auth.js'),
    _ = require('lodash'),
    math = require('mathjs');

module.exports = {
    fillProjectsOutput: fillProjectsOutput,
    fillTeamExperienceOutput: fillTeamExperienceOutput,
    fillTeamOutput: fillTeamOutput,
    fillTeamScoreOutput: fillTeamScoreOutput,
    fillWeeksDatesInput: fillWeeksDatesInput,
    fillWeeksInput: fillWeeksInput,
    fillWeeksReference: fillWeeksReference
}

function fillWeeksReference(data, auth) {
    var sheets = google.sheets('v4');

    return new Promise(function(resolve, reject) {        
        sheets.spreadsheets.values.update({
            auth: auth,
            spreadsheetId: '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
            range: '2017 Reference Projects Forecast Data!K3:K111',
            valueInputOption: 'RAW',
            resource: {
                values: data.weeks
            }
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            } else {
                resolve(data);
            }
        });
    });
}

function fillWeeksInput(data, auth) {
    var sheets = google.sheets('v4');

    return new Promise(function(resolve, reject) {        
        sheets.spreadsheets.values.update({
            auth: auth,
            spreadsheetId: '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
            range: '2017 Planned Projects Input!M3:M36',
            valueInputOption: 'RAW',
            resource: {
                values: data.weeksColumn
            }
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            } else {
                resolve(data);
            }
        });
    });
}

function fillWeeksDatesInput(data, auth) {
    var sheets = google.sheets('v4');

    return new Promise(function(resolve, reject) {        
        sheets.spreadsheets.values.update({
            auth: auth,
            spreadsheetId: '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
            range: '2017 Planned Projects Input!B3:B36',
            valueInputOption: 'RAW',
            resource: {
                values: data
            }
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            } else {
                resolve(data);
            }
        });
    });
}

function fillTeamOutput(auth, data) {
    var sheets = google.sheets('v4');

    return new Promise(function(resolve, reject) {        
        sheets.spreadsheets.values.update({
            auth: auth,
            spreadsheetId: '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
            range: '2017 Planned Output!D3:BD54',
            valueInputOption: 'RAW',
            resource: {
                values: data.teamMatrix
            }
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            } else {
                resolve(data);
            }
        });
    });
}

function fillProjectsOutput(auth, data) {
    var sheets = google.sheets('v4');

    return new Promise(function(resolve, reject) {        
        sheets.spreadsheets.values.update({
            auth: auth,
            spreadsheetId: '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
            range: '2017 Planned Output!CD3:CV54',
            valueInputOption: 'RAW',
            resource: {
                values: data.projectsMatrix
            }
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            } else {
                resolve(data);
            }
        });
    });
}

function fillTeamScoreOutput(auth, data) {
    var sheets = google.sheets('v4');

    return new Promise(function(resolve, reject) {        
        sheets.spreadsheets.values.update({
            auth: auth,
            spreadsheetId: '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
            range: '2017 Planned Output!BG3:BK54',
            valueInputOption: 'RAW',
            resource: {
                values: data.teamCareerMatrix
            }
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            } else {
                resolve(data);
            }
        });
    });
}

function fillTeamExperienceOutput(auth, data) {
    var sheets = google.sheets('v4');

    return new Promise(function(resolve, reject) {        
        sheets.spreadsheets.values.update({
            auth: auth,
            spreadsheetId: '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
            range: '2017 Planned Output!BN3:CB54',
            valueInputOption: 'RAW',
            resource: {
                values: data.teamExperienceMatrix
            }
        }, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            } else {
                resolve(data);
            }
        });
    });
}