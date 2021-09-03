module.exports = {
    description: "Начать рассылку.",
    usage: {},
    examples: {},
    aliases: [],
    permissionRequired: 0, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args) => !args.length
};

let config = require("../../config"), { getInvite } = require("../constants/"), { MessageEmbed, Guild, Message } = require("discord.js");

module.exports.run = async (message = new Message, args, gdb) => {
    if (Date.now() <= gdb.get().nextBump) return message.reply(`⏲️ Подождите ещё \`${msToTime(gdb.get().nextBump - Date.now())}\``);

    const m = await message.reply({
        embed: {
            title: "Начинаю рассылку...",
            footer: {
                icon_url: message.author.displayAvatarURL(),
                text: `Запрос от ${message.author.tag}`
            }
        }
    });

    const
        g = message.guild,
        description = gdb.get().description,
        pref = gdb.get().prefix || config.prefix,
        invite = await getInvite(g),
        //memberCount = g.members.cache.filter(member => !member.user.bot).size,
        memberCount = g.memberCount,
        channel = g.channels.cache.get(gdb.get().channel),
        ownerID = g.ownerID,
        owner = await g.members.fetch(ownerID);

    if (!description.length) return m.edit(`❌ Для начала опишите свой сервер используя команду \`${pref}description set\``);
    if (!channel) return m.edit(`❌ Не удалось найти канал рассылки партнёрств на этом сервере. Вы указывали его используя команду \`${pref}channel set\`?`);
    if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return m.edit("❌ У меня нет прав на отправление сообщений в указанном канале.");
    if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return m.edit("❌ У меня нет прав на создание приглашений в указанном канале.");
    if (!invite) return m.edit("❌ Не удалось получить приглашение. Сообщите разработчику.");

    let embed = new MessageEmbed()
        .setTitle(g.name)
        .setThumbnail(g.iconURL({ dynamic: true, size: 64 }) || "https://cdn.discordapp.com/embed/avatars/0.png")
        .setDescription(description)
        .setFooter(`ID: ${gdb.get().guildid}`)
        .setColor(gdb.get().color || config.color)
        .setTimestamp()
        .addFields([
            {
                name: "Участники",
                value: memberCount
            },
            {
                name: "Приглашение",
                value: `[discord.gg/${invite}](https://discord.gg/${invite})`
            },
            {
                name: "Владелец",
                value: `\`${owner.user.tag}\` (\`${ownerID}\`)`
            }
        ]);
    if (g.banner) {
        embed.setImage(g.bannerURL({ format: "png", size: 512 }));
        embed.setThumbnail(g.iconURL({ dynamic: true, size: 128 }) || "https://cdn.discordapp.com/embed/avatars/0.png");
    };

    let completed = 0, messageInterval = setInterval(() => {
        m.edit({
            embed: {
                title: "Идёт рассылка...",
                description: `\`${completed}/${client.guilds.cache.size}\` серверов было обработано.`,
                footer: {
                    icon_url: message.author.displayAvatarURL(),
                    text: `Запрос от ${message.author.tag}`
                }
            }
        });
    }, 1000);
    gdb.set("nextBump", Date.now() + 14400000); // 4 hours

    await Promise.all(client.guilds.cache.map(async (guild = new Guild) => {
        if (!guild.available || guild.id === message.guild.id) return;
        let guildDB = await db.guild(guild.id);
        let
            cID = guildDB.get().channel,
            channel = guild.channels.cache.get(cID);
        if (!channel) return;
        if (!channel.permissionsFor(guild.me).has("SEND_MESSAGES") && !channel.permissionsFor(guild.me).has("EMBED_LINKS")) return;
        channel.send(embed);
        completed++;
    }));
    clearInterval(messageInterval);
    return m.edit({
        embed: {
            title: "Рассылка окончена!",
            description: `Сообщение было разослано на \`${completed}/${client.guilds.cache.size}\` серверов.`,
            footer: {
                icon_url: message.author.displayAvatarURL(),
                text: `Запрос от ${message.author.tag}`
            }
        }
    });
};
