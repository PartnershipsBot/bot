// TODO

const { Guild, Message, MessageEmbed } = require("discord.js"), config = require("../../config");
const bumping = new Set();

module.exports = async (message = new Message, guild = new Guild) => {
    let isGuild = guild instanceof Guild;
    if (!isGuild) return;
    let withMessage = message instanceof Message;

    if (withMessage) m = await message.reply({
        embed: {
            title: "Начинаю рассылку...",
            footer: {
                icon_url: message.author.displayAvatarURL(),
                text: `Запрос от ${message.author.tag}`
            }
        }
    });

    const
        description = gdb.get().description,
        pref = gdb.get().prefix || config.prefix,
        invite = await getInvite(guild),
        memberCount = guild.members.cache.filter(member => !member.user.bot).size,
        channel = guild.channels.cache.get(gdb.get().channel),
        owner = guild.owner.user.tag.replace(/`/g, "`" + String.fromCharCode(8203)),
        ownerID = guild.owner.user.id;

    if (withMessage && !description.length) return m.edit(`❌ Для начала опишите свой сервер используя команду \`${pref}description set\``);
    if (withMessage && !channel) return m.edit(`❌ Не удалось найти канал рассылки партнёрств на этом сервере. Вы указывали его используя команду \`${pref}channel set\`?`);
    if (withMessage && !channel.permissionsFor(guild.me).has("SEND_MESSAGES")) return m.edit("❌ У меня нет прав на отправление сообщений в указанном канале.");
    if (withMessage && !channel.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE")) return m.edit("❌ У меня нет прав на создание приглашений в указанном канале.");
    if (withMessage && !invite) return m.edit("❌ Не удалось получить приглашение.");

    let embed = new MessageEmbed()
        .setTitle(guild.name)
        .setThumbnail(guild.iconURL({ dynamic: true, size: 64 }) || "https://cdn.discordapp.com/embed/avatars/0.png")
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
                value: `\`${owner}\` (\`${ownerID}\`)`
            }
        ]);
    if (guild.banner) {
        embed.setImage(guild.bannerURL({ format: "png", size: 512 }));
        embed.setThumbnail(guild.iconURL({ dynamic: true, size: 128 }) || "https://cdn.discordapp.com/embed/avatars/0.png");
    };

    if (withMessage) completed = 0, messageInterval = setInterval(() => {
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

    await Promise.all(client.guilds.cache.map(async (g = new Guild) => {
        if (!g.available || g.id === guild.id) return;
        let guildDB = await db.guild(guild.id);
        let
            cID = guildDB.get().channel,
            channel = g.channels.cache.get(cID);
        if (!channel) return;
        if (!channel.permissionsFor(g.me).has("SEND_MESSAGES")) return;
        channel.send(embed);
        if (withMessage) completed++;
    }));
    if (withMessage) clearInterval(messageInterval);
    gdb.set("nextBump", Date.now() + 21600000);
    if (withMessage) return m.edit({
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