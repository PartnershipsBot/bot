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
        guild = message.guild,
        description = gdb.get().description,
        pref = gdb.get().prefix || prefix,
        invite = await getInvite(g),
        memberCount = guild.members.cache.filter(member => !member.user.bot).size,
        channel = guild.channels.cache.get(gdb.get().channel),
        owner = guild.owner.user.tag.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)),
        ownerID = guild.owner.user.id;

    if (!description.length) return message.reply(`❌ Для начала опишите свой сервер используя команду \`${pref}description set\``);
    if (!channel) return message.reply(`❌ Не удалось найти канал рассылки партнёрств на этом сервере. Вы указывали его используя команду \`${pref}channel set\`?`);
    if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.reply("❌ У меня нет прав на создание приглашений в указанном канале.");
    if (!invite) return message.reply("❌ Не удалось получить приглашение. Сообщите разработчику.");

    let pv = new MessageEmbed()
        .setTitle(guild.name)
        .setThumbnail(guild.iconURL({ dynamic: true, size: 64 }) || "https://cdn.discordapp.com/embed/avatars/0.png")
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
    if (guild.banner) {
        pv.setImage(guild.bannerURL({ format: "png", size: 512 }));
        pv.setThumbnail(guild.iconURL({ dynamic: true, size: 128 }) || "https://cdn.discordapp.com/embed/avatars/0.png");
    };

    await message.reply(pv);
};