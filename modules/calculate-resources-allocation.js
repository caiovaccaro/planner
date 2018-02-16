var _ = require('lodash'),
    faker = require('faker/locale/pt_BR');

/**
 * {
 *  Role: string
 *  Type: string
 *  Level: string
 *  Available hours: int
 *  Week 01: int (hours)
 *  ...
 * }
 * 
 * For each week
 *  for each team member
 *      fill his object
 *      fill the current week
 */
module.exports = function calculateResourcesAllocation(data) {
    var teamMembers = [];

    try {
        var weeks = data.weeks,
            length = weeks.length,
            i = k = l = 0,
            n = 1,
            weeksObj = {};

        weeks.map(function(week) {
            weeksObj[week['Week Num']] = 0;
        });

        for (i; i < length; i++) {
            week = weeks[i];

            (function(week) {
                var prop, resourceQty;

                for (prop in week.team) {
                    resourceQty = week.team[prop];

                    if (resourceQty > 0) {
                        (function(resourceQty, prop, week) {
                            var j = 0;

                            for (j; j < resourceQty; j++) {
                                (function() {
                                    var member, weekNum,
                                        resource = _.find(data.sheetReferenceTeam, { ID: prop }),
                                        weekNum = week['Week Num'],
                                        existingMember = _.filter(teamMembers, function(member) {
                                            return member.role === resource['Role'] && (!member[weekNum] || parseInt(member[weekNum], 10) < 40)
                                        }), existingMemberKey;

                                    member = existingMember.length ? existingMember[0] : {
                                        id: n,
                                        name: faker.name.findName(),
                                        role: resource['Role'],
                                        type: resource['Type'],
                                        level: resource['Level'],
                                        availableHours: resource['Available hours'],
                                        empty: null,
                                        empty: null,
                                        empty: null
                                    };

                                    if (!existingMember.length) {
                                        _.merge(member, weeksObj);
                                        n++;
                                    } else {
                                        existingMemberKey = _.findIndex(teamMembers, existingMember[0]);
                                    }

                                    member[weekNum] = member[weekNum] ? parseInt(member[weekNum], 10) + parseInt(member.availableHours, 10) : parseInt(member.availableHours, 10);
                                    
                                    if (!existingMember.length) {
                                        teamMembers.push(member);
                                    } else {
                                        teamMembers[existingMemberKey] = member;
                                    }
                                })();
                            }
                        })(resourceQty, prop, week);
                    }
                }
            })(week);
        }

        data.teamAllocation = teamMembers;

        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(err);
    }
}