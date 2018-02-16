var _ = require('lodash'),
    moment = require('moment'),
    math = require('mathjs');

/**
 * For each week
 *  get each type of resource
 *      and multiply its number by the respective exp score
 *      sum each type of experience and add to the week
 */
module.exports  = function buildTeamExperienceOutputMatrix(data) {
    try {
        var weeks = data.weeks,
            i = j = k = l = m = n = o = p = q = r = s = t = u = v = x = y = 0,
            length = weeks.length,
            row, expClientInterface, expClientUIApplication, expClientCreative,
            expClientNoUIApplication, expPlatformEcommerce, expPlatformCMS,
            expEmergingPlatforms, expServerDirect, expServerEnterprise,
            expMobileNative, expMobileHybrid, expInfrastructureDirect,
            expInfrastructureEnterprise, expDataAnalysis, expDataVisualization,
            prop, resource, resourceQty, resourceType,
            teamExperienceMatrix = [];

        for (i; i < length; i++) {
            week = weeks[i];

            row = [];

            row[0] = 0;
            row[1] = 0;
            row[2] = 0;
            row[3] = 0;
            row[4] = 0;
            row[5] = 0;
            row[6] = 0;
            row[7] = 0;
            row[8] = 0;
            row[9] = 0;
            row[10] = 0;
            row[11] = 0;
            row[12] = 0;
            row[13] = 0;

            expClientInterface = [];
            expClientUIApplication = [];
            expClientCreative = [];
            expClientNoUIApplication = [];
            expPlatformEcommerce = [];
            expPlatformCMS = [];
            expEmergingPlatforms = [];
            expServerDirect = [];
            expServerEnterprise = [];
            expMobileNative = [];
            expMobileHybrid = [];
            expInfrastructureDirect = [];
            expInfrastructureEnterprise = [];
            expDataAnalysis = [];
            expDataVisualization = [];

            for (prop in week.team) {
                var resourceQty = week.team[prop];

                if (resourceQty > 0) {
                    resource = _.find(data.sheetReferenceTeam, { ID: prop });
                    resourceType = resource['Type'];

                    if (resourceType && resourceType !== 'L') {
                        for (j; j < resourceQty; j++) {
                            expClientInterface.push(parseFloat(resource['Exp Client Interface']));
                        }
                        for (k; k < resourceQty; k++) {
                            expClientUIApplication.push(parseFloat(resource['Exp Client UI Application']));
                        }
                        for (y; y < resourceQty; y++) {
                            expClientCreative.push(parseFloat(resource['Exp Client Creative']));
                        }
                        for (l; l < resourceQty; l++) {
                            expClientNoUIApplication.push(parseFloat(resource['Exp Client No-UI Application']));
                        }
                        for (m; m < resourceQty; m++) {
                            expPlatformEcommerce.push(parseFloat(resource['Exp Platform Ecommerce']));
                        }
                        for (n; n < resourceQty; n++) {
                            expPlatformCMS.push(parseFloat(resource['Exp Platform CMS']));
                        }
                        for (o; o < resourceQty; o++) {
                            expEmergingPlatforms.push(parseFloat(resource['Exp Emerging Platforms']));
                        }
                        for (p; p < resourceQty; p++) {
                            expServerDirect.push(parseFloat(resource['Exp Server Direct']));
                        }
                        for (q; q < resourceQty; q++) {
                            expServerEnterprise.push(parseFloat(resource['Exp Server Enterprise']));
                        }
                        for (r; r < resourceQty; r++) {
                            expMobileNative.push(parseFloat(resource['Exp Mobile Native']));
                        }
                        for (s; s < resourceQty; s++) {
                            expMobileHybrid.push(parseFloat(resource['Exp Mobile Hybrid']));
                        }
                        for (t; t < resourceQty; t++) {
                            expInfrastructureDirect.push(parseFloat(resource['Exp Infrastructure Direct']));
                        }
                        for (u; u < resourceQty; u++) {
                            expInfrastructureEnterprise.push(parseFloat(resource['Exp Infrastructure Enterprise']));
                        }
                        for (v; v < resourceQty; v++) {
                            expDataAnalysis.push(parseFloat(resource['Exp Data Analysis']));
                        }
                        for (x; x < resourceQty; x++) {
                            expDataVisualization.push(parseFloat(resource['Exp Data Visualization']));
                        }
                    }
                }
            }

            row[0] = expClientInterface.length ? math.median(expClientInterface) : 0;
            row[1] = expClientUIApplication.length ? math.median(expClientUIApplication) : 0;
            row[2] = expClientCreative.length ? math.median(expClientCreative) : 0;
            row[3] = expClientNoUIApplication.length ? math.median(expClientNoUIApplication) : 0;
            row[4] = expPlatformEcommerce.length ? math.median(expPlatformEcommerce) : 0;
            row[5] = expPlatformCMS.length ? math.median(expPlatformCMS) : 0;
            row[6] = expEmergingPlatforms.length ? math.median(expEmergingPlatforms) : 0;
            row[7] = expServerDirect.length ? math.median(expServerDirect) : 0;
            row[8] = expServerEnterprise.length ? math.median(expServerEnterprise) : 0;
            row[9] = expMobileNative.length ? math.median(expMobileNative) : 0;
            row[10] = expMobileHybrid.length ? math.median(expMobileHybrid) : 0;
            row[11] = expInfrastructureDirect.length ? math.median(expInfrastructureDirect) : 0;
            row[12] = expInfrastructureEnterprise.length ? math.median(expInfrastructureEnterprise) : 0;
            row[13] = expDataAnalysis.length ? math.median(expDataAnalysis) : 0;
            row[14] = expDataVisualization.length ? math.median(expDataVisualization) : 0;

            teamExperienceMatrix.push(row);
        }

        data.teamExperienceMatrix = teamExperienceMatrix;

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(err);
    }
}