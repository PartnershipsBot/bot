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
    return m.edit("", {
        embed: {
            title: "🏓 Понг",
            footer: {
                icon_url: message.author.displayAvatarURL(),
                text: `Запрос от ${message.author.tag}`
            },
            fields: [
                {
                    name: "Cервер",
                    value: `\`${m.createdTimestamp - message.createdTimestamp}ms\``
                },
                {
                    name: "API",
                    value: `\`${Math.round(message.client.ws.ping)}ms\``
                },
                {
                    name: "Аптайм",
                    value: `\`${msToTime(message.client.uptime)}\``
                }
            ]
        },
    }).catch(err => message.channel.send(`❌ Произошла неизвестная ошибка. Пожалуйста, проинформируйте создателя бота. Лог ошибки:\n\`\`\`fix\n${err.stack}\n\`\`\``));
};