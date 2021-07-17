const config = require("../../config");

// load other files, and also general information
module.exports = Object.assign(
    require("./time"), require("./resolvers")
);

module.exports.getPermissionLevel = member => {
    if (config.admins[0] == member.user.id) return 4; // bot owner
    if (config.admins.includes(member.user.id)) return 3; // bot admin
    if (member.guild.ownerID == member.id) return 2; // server owner
    if (member.hasPermission("MANAGE_GUILD")) return 1; // server admin
    return 0; // server member
};

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
    else if (endsWith(number, 1)) returning = `${number} ${word}`;
    else if (
        endsWith(number, 2) ||
        endsWith(number, 3) ||
        endsWith(number, 4)
    ) returning = `${number} ${word}а`;
    else return false;

    return returning;
};