module.exports = {
    description: "Настройка канала отправки партнёрств.",
    usage: {
        "<set|reset>": "Подкоманда; `set` - установить, `reset` - сбросить.",
        "<#канал|ID>": "Упоминание канала, если подкоманда `set`."
    },
    examples: {},
    aliases: ["ch"],
    permissionRequired: 1, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args) => (args[0] == "reset" && !args[1]) || (args[0] == "set" && args[1]) && !args[2]
};

module.exports.run = async (message, args, gdb) => {
    let mode = args[0];

    switch (mode) {
        case "reset":
            try {
                await gdb.set("channel", "");
                await message.react("✅");
            } catch (err) {
                message.reply(`❌ Произошла неизвестная ошибка. Пожалуйста, проинформируйте создателя бота. Лог ошибки:\n\`\`\`fix\n${err.stack}\n\`\`\``);
            };
            break;
        case "set":
            let c;
            if (message.mentions.channels.first()) c = message.mentions.channels.first().id;
            else c = args[1];

            if (!c) c = message.channel.id;

            let gc = message.guild.channels.cache.get(c);

            if (!gc) return message.reply("❌ Не удалось найти указанный канал.");
            
            try {
                await gdb.set("channel", c);
                await message.react("✅");
                await message.reply(`✅ Канал отправки партнёрств был успешно установлен (<#${gc.id}>)`);
            } catch (err) {
                message.reply(`❌ Произошла неизвестная ошибка. Пожалуйста, проинформируйте создателя бота. Лог ошибки:\n\`\`\`fix\n${err.stack}\n\`\`\``);
            };
            break;
    };
};