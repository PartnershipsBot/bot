const { GuildMember, Guild } = require('discord.js');
const config = require('../../config');

// load other files, and also general information
module.exports = Object.assign({
    embedColor: 0xBD4632,
    hexColor: "BD4632"
}, require("./time.js"));

/**
 * 
 * @param {GuildMember} member 
 * @returns integer
 */
module.exports.getPermissionLevel = member => {
    if (config.admins[0] == member.user.id) return 4; // bot owner
    if (config.admins.includes(member.user.id)) return 3; // bot admin
    if (member.guild.ownerID == member.id) return 2; // server owner
    if (member.hasPermission("MANAGE_GUILD")) return 1; // server admin
    return 0; // server member
};

/**
 * 
 * @param {Guild} guild
 * @returns string
 */
module.exports.getInvite = async (guild, gdb) => {

    if (!guild || !gdb) return false;

    let i;

    guild.fetchInvites()
        .then(c => i = c.find(inv => inv.inviter.id === guild.client.user.id))
        .catch(console.error());

    if (i) i = i.code;
    else {
        let c = await guild.channels.fetch(gdb.get().channel);
        c.createInvite({
            maxAge: 0
        }).then(inv => i = inv.code);
    };

    return i;
};

/**
 * 
 * @param {Number} number 
 * @param {String} word 
 * @returns string
 */
module.exports.plurify = (number, word) => {
    function endsWith(str, suffix) { return String(str).match(suffix+"$")==suffix; };

    let returning;
    if (
        endsWith(number, 0) ||
        endsWith(number, 5) ||
        endsWith(number, 6) ||
        endsWith(number, 7) ||
        endsWith(number, 8) ||
        endsWith(number, 9)
    ) returning = `${number} ${word}ов`;
    if (endsWith(number, 1)) returning = `${number} ${word}`;
    if (
        endsWith(number, 2) ||
        endsWith(number, 3) ||
        endsWith(number, 4)
    ) returning = `${number} ${word}а`;

    return returning;
};