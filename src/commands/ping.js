module.exports = {
    description: "Get the latency of the bot.",
    usage: {},
    examples: {},
    aliases: ["pong", "latency"],
    permissionRequired: 0, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args) => !args.length
};

const { msToTime } = require("../constants/");

module.exports.run = async (message) => {
    const uptime = msToTime(message.client.uptime);
    const api = Math.ceil(message.client.ws.ping);
    const server = Date.now() - message.createdTimestamp;

    return await message.reply(`🏓 Пинг сервера \`${server}ms\`, пинг API \`${api}ms\`, аптайм бота \`${uptime}\`.`);
};