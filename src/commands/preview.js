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
        pref = gdb.get().prefix || prefix,
        guild = message.guild,
        invite = await getInvite(guild, gdb),
        memberCount = guild.members.cache.filter(member => !member.user.bot).size,
        owner = guild.owner.user.tag.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)),
        ownerID = guild.owner.user.id;

    if (!invite) return message.reply(`❌ Не удалось получить приглашение. Вы устанавливали канал используя команду \`${pref}channel set\`?`);

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

    message.reply(pv);
};