var postSheetData = require('../utils/postSheetData');

module.exports = {
    fillProjectsOutput: fillProjectsOutput,
    fillTeamExperienceOutput: fillTeamExperienceOutput,
    fillTeamOutput: fillTeamOutput,
    fillTeamScoreOutput: fillTeamScoreOutput,
    fillWeeksDatesInput: fillWeeksDatesInput,
    fillWeeksInput: fillWeeksInput,
    fillWeeksReference: fillWeeksReference,
    fillTeamAllocation: fillTeamAllocation,
    fillProjectsView: fillProjectsView,
    fillCapabilities: fillCapabilities,
    fillFinance: fillFinance
}

function fillWeeksReference(data, auth) {
    return postSheetData(
        auth,
        data.weeksReference,
        '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
        '2017 Reference Projects Forecast Data!K3:K111',
        'RAW'
    );
}

function fillWeeksInput(data, auth) {
    return postSheetData(
        auth,
        data.weeksInput,
        '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
        '2017 Planned Projects Input!N3:N36',
        'RAW',
        data.weeksInput
    );
}

function fillWeeksDatesInput(data, auth) {
    return postSheetData(
        auth,
        data[0],
        '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
        '2017 Planned Projects Input!B3:B36',
        'RAW',
        data[1]
    );
}

function fillTeamOutput(auth, data) {
    return postSheetData(
        auth,
        data.teamMatrix,
        '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
        '2017 Planned Output!D3:BD54',
        'RAW'
    );
}

function fillProjectsOutput(auth, data) {
    return postSheetData(
        auth,
        data.projectsMatrix,
        '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
        '2017 Planned Output!CD3:CV54',
        'RAW'
    );
}

function fillTeamScoreOutput(auth, data) {
    return postSheetData(
        auth,
        data.teamCareerMatrix,
        '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
        '2017 Planned Output!BG3:BK54',
        'RAW'
    );
}

function fillTeamExperienceOutput(auth, data) {
    return postSheetData(
        auth,
        data.teamExperienceMatrix,
        '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
        '2017 Planned Output!BN3:CB54',
        'RAW'
    );
}

function fillTeamAllocation(auth, data) {
    return postSheetData(
        auth,
        data.teamAllocationMatrix,
        '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
        '2017 Planned Team Output!A2:BI1002',
        'RAW'
    );
}

function fillProjectsView(auth, data) {
    return postSheetData(
        auth,
        data.projectsViewMatrix,
        '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
        '2017 Planned Projects Output!A1:BH1002',
        'RAW'
    );
}

function fillCapabilities(auth, data) {
    return Promise.all(
        [
            fillCapabilitiesWeek(auth, data),
            fillCapabilitiesYear(auth,data)
        ]
    );
}

function fillCapabilitiesWeek(auth, data) {
    return postSheetData(
        auth,
        data.capabilitiesOutput,
        '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
        '2017 Planned Capabilities Output!A2:E1000',
        'RAW'
    );
}

function fillCapabilitiesYear(auth, data) {
    return postSheetData(
        auth,
        data.capabilitiesOutputYear,
        '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
        '2017 Planned Capabilities Output!J2:M1000',
        'RAW'
    );
}

function fillFinance(auth, data) {
    return postSheetData(
        auth,
        data.financeMatrix,
        '1uwqxl9tinbUG79m_O1ONg6R5AzrjEzgcPDxt2gwe86Q',
        '2017 Planned Finance Goal Output!A2:C53',
        'RAW'
    );
}