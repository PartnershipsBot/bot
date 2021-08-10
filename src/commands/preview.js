module.exports = {
    description: "Предпросмотр сообщения о сервере.",
    usage: {},
    examples: {},
    aliases: ["pv"],
    permissionRequired: 0, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args, permissionLevel) => permissionLevel <= 2 && !args.length || permissionLevel >= 3 && !!args[0] && !args[1]
};

const { MessageEmbed, Message } = require("discord.js"), { color, prefix } = require("../../config"), { getInvite } = require("../constants/");

module.exports.run = async (message = new Message, args, gdb, { permissionLevel }) => {
    let pv = new MessageEmbed();

    if (permissionLevel => 3) {
        const
            g = args[0] ? client.guilds.cache.get(args[0]) : message.guild,
            guildDB = await db.guild(g.id),
            description = guildDB.get().description,
            pref = guildDB.get().prefix || prefix,
            invite = await getInvite(g, guildDB),
            memberCount = g.members.cache.filter(member => !member.user.bot).size,
            channel = g.channels.cache.get(guildDB.get().channel),
            owner = g.owner.user.tag.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)),
            ownerID = g.owner.user.id;

        if (!channel) return message.reply("❌ Не удалось найти канал рассылки партнёрств на этом сервере.");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.reply("❌ У меня нет прав на создание приглашений в указанном канале.");
        if (!invite) return message.reply("❌ Не удалось получить приглашение. Сообщите разработчику.");

        pv.setTitle(g.name)
            .setThumbnail(g.iconURL({ dynamic: true, size: 64 }) || "https://cdn.discordapp.com/embed/avatars/0.png")
            .setDescription(description)
            .setFooter(`ID: ${guildDB.get().guildid}`)
            .setColor(guildDB.get().color || color)
            .setTimestamp()
            .addFields([
                {
                    name: "Участники",
                    value: memberCount,
                    inline: true
                },
                {
                    name: "Приглашение",
                    value: `[discord.gg/${invite}](https://discord.gg/${invite})`
                },
                {
                    name: "Владелец",
                    value: `\`${owner}\` (\`${ownerID}\`)`
                }
            ]);
        if (g.banner) {
            pv.setImage(g.bannerURL({ format: "png", size: 512 }));
            pv.setThumbnail(g.iconURL({ dynamic: true, size: 128 }) || "https://cdn.discordapp.com/embed/avatars/0.png");
        };
    } else {
        const
            g = message.guild,
            description = gdb.get().description,
            pref = gdb.get().prefix || prefix,
            invite = await getInvite(g),
            memberCount = g.members.cache.filter(member => !member.user.bot).size,
            channel = g.channels.cache.get(gdb.get().channel),
            owner = g.owner.user.tag.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)),
            ownerID = g.owner.user.id;

        if (!description.length) return message.reply(`❌ Для начала опишите свой сервер используя команду \`${pref}description set\``);
        if (!channel) return message.reply(`❌ Не удалось найти канал рассылки партнёрств на этом сервере. Вы указывали его используя команду \`${pref}channel set\`?`);
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.reply("❌ У меня нет прав на создание приглашений в указанном канале.");
        if (!invite) return message.reply("❌ Не удалось получить приглашение. Сообщите разработчику.");

        pv.setTitle(g.name)
            .setThumbnail(g.iconURL({ dynamic: true, size: 64 }) || "https://cdn.discordapp.com/embed/avatars/0.png")
            .setDescription(description)
            .setFooter(`ID: ${gdb.get().guildid}`)
            .setColor(gdb.get().color || color)
            .setTimestamp()
            .addFields([
                {
                    name: "Участники",
                    value: memberCount,
                    inline: true
                },
                {
                    name: "Приглашение",
                    value: `[discord.gg/${invite}](https://discord.gg/${invite})`
                },
                {
                    name: "Владелец",
                    value: `\`${owner}\` (\`${ownerID}\`)`
                }
            ]);
        if (g.banner) {
            pv.setImage(g.bannerURL({ format: "png", size: 512 }));
            pv.setThumbnail(g.iconURL({ dynamic: true, size: 128 }) || "https://cdn.discordapp.com/embed/avatars/0.png");
        };
    };

    await message.reply(pv);
};