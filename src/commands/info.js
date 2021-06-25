module.exports = {
    description: "Информация и статистика бота.",
    usage: {},
    examples: {},
    aliases: [ "stats", "botinfo", "botstats" ],
    permissionRequired: 0, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args) => !args.length
};
  
const os = require("os"),
    platform = `${os.type()} (${os.release()})`,
    djsversion = require("../../package.json").dependencies["discord.js"],
    config = require("../../config");

let guilds = 0, users = 0, shardCount = 0, memory = 0, memoryUsage = "0MB", memoryGlobal = 0, memoryUsageGlobal = "0MB", nextUpdate = Date.now();

module.exports.run = async (message, _) => {
    if (nextUpdate < Date.now()) {
        nextUpdate = Date.now() + 300000; 
        if (message.client.shard) {
            guilds = await message.client.shard.broadcastEval("this.guilds.cache.size").then(res => res.reduce((prev, val) => prev + val, 0));
            users = await message.client.shard.broadcastEval("this.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)").then(res => res.reduce((prev, val) => prev + val, 0));
            shardCount = message.client.shard.count;
        } else {
            guilds = message.client.guilds.cache.size;
            users = message.client.users.cache.size;
            shardCount = 0;
        };

        const { heapUsed, rss } = process.memoryUsage();

        memory = heapUsed / (1048576); // 1024*1024
        if (memory >= 1024) memoryUsage = (memory / 1024).toFixed(2) + "GB";
        else memoryUsage = memory.toFixed(2) + "MB";

        memoryGlobal = rss / (1048576); // 1024*1024
        if (memoryGlobal >= 1024) memoryUsageGlobal = (memoryGlobal / 1024).toFixed(2) + "GB";
        else memoryUsageGlobal = memoryGlobal.toFixed(2) + "MB";
    };

    message.channel.send({
        embed: {
            title: `Информация о боте - ${message.client.user.tag}`,
            color: config.color,
            timestamp: Date.now(),
            footer: {
                icon_url: message.author.displayAvatarURL(),
                text: `Запрос от ${message.author.tag}`
            },
            fields: [
                {
                    name: "💠 Хост",
                    value: [
                        `**ОС**: \`${platform}\``,
                        `**Библиотека**: \`discord.js${djsversion}\``,
                        `**Исп. ОЗУ**: \`${message.client.shard ? memoryUsageGlobal : memoryUsage}\``
                    ].join("\n"),
                    inline: true
                },
                {
                    name: "🌀 Статистика",
                    value: [
                        `**Кол-во серверов**: \`${guilds}\``,
                        `**Кол-во юзеров**: \`${users}\``,
                        `**Кол-во шардов**: \`${shardCount}\``
                    ].join("\n"),
                    inline: true
                },
                {
                    name: message.client.shard ? `🔷 Этот шард (${message.guild.shardID})` : false,
                    value: [
                        `**Кол-во серверов**: \`${message.client.guilds.cache.size}\``,
                        `**Кол-во юзеров**: \`${message.client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)}\``,
                        `**Исп. ОЗУ**: \`${memoryUsage}\``
                    ].join("\n"),
                    inline: true
                },
                {
                    name: "🌐 Ссылки",
                    value: [
                        `**Пригласи меня:** [тык](https://discord.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=8&scope=bot%20applications.commands)`,
                        "**Сервер поддержки**: https://discord.gg/PrJthKRbvz"
                    ].join("\n"),
                    inline: false
                }
            ].filter(f => f.name) // filters out shard field if sharding is disabled
        }
    }).catch(err => message.channel.send(`❌ Произошла неизвестная ошибка. Пожалуйста, проинформируйте создателя бота. Лог ошибки:\n\`\`\`fix\n${err.stack}\n\`\`\``));
};
