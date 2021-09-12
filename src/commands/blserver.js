module.exports = {
    description: "привет :D",
    usage: {},
    examples: {},
    aliases: [],
    permissionRequired: 4, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args) => args.length == 1
};

module.exports.run = async (message, args) => {
    let toEdit = "";
    const m = await message.reply("Работаю...");
    const guild = client.guilds.cache.get(args[0]);

    if (guild) {
        const owner = await client.users.fetch(guild.ownerID);
        if (owner) {
            await owner.send(
                `Я покинул Ваш сервер **${guild.name}** из-за добавления его в Чёрный Список создателем бота.\n\n` +
                "Если Вы хотите обжаловать это, заходите на наш сервер поддержки - https://dsc.gg/sof"
            ).then(() => {
                toEdit = "Сообщение в ЛС создателю сервера было отправлено.";
                m.edit(toEdit);
            }).catch(() => {
                toEdit = "Не удалось отправить сообщение в ЛС создателя сервера.";
                m.edit(toEdit);
            });
        };

        await guild.leave().then(() => {
            toEdit = `Я покинул сервер.`;
            m.edit(toEdit);
        });
    };

    gldb.addToArray("blacklistedServers", args[0]);

    toEdit = "Готово.";
    await m.edit(toEdit);
};