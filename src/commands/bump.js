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
    if (Date.now() <= gdb.get().nextBump) return () => {
        message.reply(`⏲️ Подождите ещё \`${msToTime(gdb.get().nextBump - Date.now())}\``);
    };

    const m = await message.reply({
        embed: {
            title: "Начинаю рассылку...",
            footer: {
                icon_url: message.author.displayAvatarURL(),
                text: `Запрос от ${message.author.tag}`
            }
        }
    });

    let
        g = message.guild,
        cID = gdb.get().channel,
        c = g.channels.cache.get(cID);
    if (!c) return;

    const
        pref = gdb.get().prefix || config.prefix,
        invite = await getInvite(g, gdb),
        memberCount = g.members.cache.filter(member => !member.user.bot).size,
        owner = g.owner.user.tag.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)),
        ownerID = g.owner.user.id;
    if (!invite) return m.edit(`❌ Не удалось получить приглашение. Вы устанавливали канал используя команду \`${pref}channel set\`?`);

    let embed = new MessageEmbed()
        .setTitle(g.name)
        .setThumbnail(g.iconURL({ dynamic: true, size: 64 }) || "https://cdn.discordapp.com/embed/avatars/0.png")
        .setDescription(gdb.get().description)
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
                value: `\`${owner}\` (\`${ownerID}\`)`
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
    await Promise.all(client.guilds.cache.map(async (guild = new Guild) => {
        if (!guild.available || guild.id == message.guild.id) return;
        guildDB = await db.guild(guild.id);
        let
            cID = guildDB.get().channel,
            channel = guild.channels.cache.get(cID);
        if (!channel) return;
        channel.send(embed);
        completed++;
    }));
    clearInterval(messageInterval);
    gdb.set("nextBump", Date.now() + 10800000); // 3h cd
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