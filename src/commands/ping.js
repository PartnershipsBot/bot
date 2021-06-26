module.exports = {
    description: "Get the latency of the bot.",
    usage: {},
    examples: {},
    aliases: [ "pong", "latency" ],
    permissionRequired: 0, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args) => !args.length
};

module.exports.run = async message => {
    const m = await message.channel.send("〽️ Собираю информацию...");
    return m.edit(`🏓 Задержка сервера \`${m.createdTimestamp - message.createdTimestamp}ms\`, задержка API \`${Math.round(message.client.ws.ping)}ms\`, аптайм \`${msToTime(message.client.uptime)}\`.`);
};