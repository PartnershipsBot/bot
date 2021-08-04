require("./extendedMessage");
const
    Discord = require("discord.js"),
    config = require("../config"),
    { prefix } = require("../config"),
    commandHandler = require("./handlers/commands"),
    client = new Discord.Client({
        messageCacheMaxSize: 20,
        messageCacheLifetime: 10,
        messageSweepInterval: 30,
        messageEditHistoryMaxSize: 0,
        disableMentions: "all",
        partials: ["GUILD_MEMBER", "MESSAGE"],
        presence: {
            status: "dnd",
            activity: {
                type: "WATCHING",
                name: "загрузочный экран"
            }
        }
    }),
    log = require("./handlers/logger"),
    db = require("./database/")();

global.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
global.getInvite = require("./constants/").getInvite;
global.msToTime = require("./constants/").msToTime;
global.plurify = require("./constants/").plurify;
global.root = __dirname;
global.client = client;
global.log = log;
global.db = db;

let shard = "[Shard N/A]";

client.once("shardReady", async (shardid, unavailable = new Set()) => {
    shard = `[Shard ${shardid}]`;
    log.log(`${shard} Ready as ${client.user.tag}! Caching guilds.`);

    client.loading = true;

    disabledGuilds = new Set([...Array.from(unavailable), ...client.guilds.cache.map(guild => guild.id)]);
    let guildCachingStart = Date.now();

    await db.cacheGuilds(disabledGuilds);
    log.log(`${shard} All ${disabledGuilds.size} guilds have been cached. [${Date.now() - guildCachingStart}ms]`);

    let userCachingStart = Date.now();
    await Promise.all(client.guilds.cache.map(guild => guild.members.fetch()));
    log.log(`${shard} All ${client.users.cache.size} users have been cached. [${Date.now() - userCachingStart}ms]`);

    disabledGuilds = false;
    client.loading = false;

    updatePresence();
    client.setInterval(updatePresence, 10000);
});

client.on("message", async message => {
    global.msg = message;

    if (
        !message.guild ||
        message.author.bot ||
        message.type !== "DEFAULT"
    ) return;

    const gdb = await db.guild(message.guild.id);
    global.gdb = gdb;

    let { prefix } = gdb.get();
    if (!prefix.length) prefix = config.prefix;

    if (message.content.startsWith(prefix) || message.content.match(`^<@!?${client.user.id}> `)) return commandHandler(message, prefix, gdb, db);
    if (message.content.match(`^<@!?${client.user.id}>`)) return message.reply(`👋 Мой префикс на этом сервере \`${prefix}\`, для помощи напишите \`${prefix}help\`.`);
});

async function updatePresence() {
    let guildCount = await client.shard.broadcastEval("this.guilds.cache.size").then(res => res.reduce((prev, val) => prev + val, 0));

    let name = `${prefix}help • ${plurify(guildCount, "сервер")}`;
    return client.user.setPresence({
        status: "online",
        activity: { type: "WATCHING", name }
    });
};

client.on("guildCreate", async guild => {
    await guild.members.fetch({ force: true });
    const c = client.channels.cache.get("868094755043704842"),
        e = "<a:fuck:868103266662232124><a:fuck:868103266662232124>";

    c.send(`${e}New guild${e}`, {
        embed: {
            title: guild.name,
            thumbnail: {
                url: guild.iconURL({ dynamic: true, format: "png", size: 64 })
            },
            footer: {
                text: `ID: ${guild.id}`
            }
        }
    });
});

client.on("guildDelete", async guild => {
    const c = client.channels.cache.get("868094755043704842"),
        e = "<a:fuck:868103266662232124><a:fuck:868103266662232124>";

    c.send(`${e}Guild removed${e}`, {
        embed: {
            title: guild.name,
            thumbnail: {
                url: guild.iconURL({ dynamic: true, format: "png", size: 64 })
            },
            footer: {
                text: `ID: ${guild.id}`
            }
        }
    });
});

client
    .on("error", err => log.error(`${shard} Client error. ${err}`))
    .on("rateLimit", rateLimitInfo => log.warn(`${shard} Rate limited. ${JSON.stringify(rateLimitInfo)}`))
    .on("shardDisconnected", closeEvent => log.warn(`${shard} Disconnected. ${closeEvent}`))
    .on("shardError", err => log.error(`${shard} Error. ${err}`))
    .on("shardReconnecting", () => log.log(`${shard} Reconnecting.`))
    .on("shardResume", (_, replayedEvents) => log.log(`${shard} Resumed. ${replayedEvents} replayed events.`))
    .on("warn", info => log.warn(`${shard} Warning. ${info}`))
    .login(config.token);

process.on("unhandledRejection", rej => log.error(rej.stack));