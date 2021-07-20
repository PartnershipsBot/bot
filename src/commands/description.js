module.exports = {
    description: "Настройка описания сервера.",
    usage: {
        "<set|reset>": "Подкоманда; `set` - установить, `reset` - сбросить.",
        "<описание>": "Описание сервера."
    },
    examples: {},
    aliases: ["desc"],
    permissionRequired: 1, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args) => (args[0] == "reset" && !args[1]) || (args[0] == "set" && args[1])
};

module.exports.run = async (message, args, gdb) => {
    let mode = args[0];

    switch (mode) {
        case "reset":
            await gdb.set("description", "");
            await message.react("✅");
            break;
        case "set":
            let desc = args.join(" ").slice(3).trim();

            if (desc.length > 2048) return message.reply("❌ Описание сервера не должно быть длиннее за 2048 символов.");

            await gdb.set("description", desc);
            await message.react("✅");
            break;
    };
};