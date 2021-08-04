module.exports = {
    description: "Настройка цвета панели сообщения о сервере.",
    usage: {
        "<set|reset>": "Подкоманда; `set` - установить, `reset` - сбросить.",
        "<HEX-код>": "HEX-код цвета. (`#ABC`|`#AABBCC`)"
    },
    examples: {},
    aliases: [],
    permissionRequired: 1, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args) => (args[0] == "reset" && !args[1].length) || (args[0] == "set" && !!args[1].length)
};

module.exports.run = async (message, args, gdb) => {
    let mode = args[0];

    switch (mode) {
        case "reset":
            await gdb.set("color", "");
            await message.react("✅");
            break;
        case "set":
            const color = args[1].trim().match(/^#([0-9A-F]{3}){1,2}$/i)[0];

            if (!color) return message.react("❌");

            await gdb.set("color", color);
            await message.react("✅");
            break;
    };
};