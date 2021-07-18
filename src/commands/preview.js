module.exports = {
    description: "Предпросмотр сообщения о сервере.",
    usage: {},
    examples: {},
    aliases: ["pv"],
    permissionRequired: 0, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args) => !args.length
};

const { MessageEmbed } = require("discord.js"), { color } = require("../../config"), { getInvite } = require("../constants/");

module.exports.run = async (message, args, gdb) => {
    const guild = client.guilds.cache.get(gdb.get().guildid),
        invite = await getInvite(guild, gdb);
    let pv = new MessageEmbed()
        .setTitle(guild.name)
        .setThumbnail(guild.iconURL({ dynamic: true, size: 64 }))
        .setDescription(gdb.get().description)
        .setFooter(`ID: ${gdb.get().guildid}`)
        .setColor(gdb.get().color || color)
        .setTimestamp()
        .addFields([
            {
                name: "Участники",
                value: guild.members.cache.filter(member => !member.user.bot).size,
                inline: true
            },
            {
                name: "Приглашение",
                value: `discord.gg/${invite}`
            },
            {
                name: "Владелец",
                value: `${guild.owner.user.tag} (\`${guild.owner.user.id}\`)`
            }
        ]);

    message.reply(pv);
};