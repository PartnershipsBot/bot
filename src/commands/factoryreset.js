module.exports = {
    description: "Сбросить все данные о сервере.",
    usage: {},
    examples: {},
    aliases: [],
    permissionRequired: 2, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args) => !args.length
};
  
module.exports.run = async (message, args, gdb) => {
    const confirmation = await new Promise(resolve => {
        message.channel.send("⚠️ Вы уверены что хотите удалить все данные об этом сервере? Вы не сможете восстановить ничего после этого!\nНапишите `да` или `нет`.");
        message.channel.awaitMessages(m => m.author.id == message.author.id && ["да", "нет"].includes(m.content.toLowerCase()), { max: 1, time: 30000, errors: [ "time" ]})
            .then(collection => collection.first().content == "да" ? resolve(true) : resolve(false))
            .catch(() => resolve(false));
    });
    if (!confirmation) return message.channel.send("✴️ Сброс настроек был отменён.");
  
    gdb.reset();
    
    return message.channel.send("☠️ Все настройки были сброшены. Имейте в виду, что префикс также был сброшен.");
};