module.exports = {
    description: "Предпросмотр сообщения о сервере.",
    usage: {},
    examples: {},
    aliases: ["pv"],
    permissionRequired: 0, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args) => !args.length
};

const { MessageEmbed, Message } = require("discord.js"), { color, prefix } = require("../../config"), { getInvite } = require("../constants/");

module.exports.run = async (message = new Message, args, gdb) => {
    const
        g = message.guild,
        description = gdb.get().description,
        pref = gdb.get().prefix || prefix,
        invite = await getInvite(g, gdb),
        memberCount = g.members.cache.filter(member => !member.user.bot).size,
        channel = g.channels.cache.get(gdb.get().channel),
        owner = g.owner.user.tag.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)),
        ownerID = g.owner.user.id;

    if (!description.length) return m.edit(`❌ Для начала опишите свой сервер используя команду \`${pref}description set\``);
    if (!channel) return m.edit(`❌ Не удалось найти канал рассылки партнёрств на этом сервере. Вы указывали его используя команду \`${pref}channel set\`?`);
    if (!channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return m.edit("❌ У меня нет прав на отправление сообщений в указанном канале.");
    if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return m.edit("❌ У меня нет прав на создание приглашений в указанном канале.");
    if (!invite) return m.edit("❌ Не удалось получить приглашение. Сообщите разработчику.");

    let pv = new MessageEmbed()
        .setTitle(g.name)
        .setThumbnail(g.iconURL({ dynamic: true, size: 64 }) || "https://cdn.discordapp.com/embed/avatars/0.png")
        .setDescription(gdb.get().description)
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

    message.reply(pv);
};