const
    chalk = require("chalk"),
    Discord = require("discord.js"),
    config = require("../../config"),
    { info, warn, error } = config.loggers,
    e = "<a:fuck:868103266662232124>";

const
    infoWH = new Discord.WebhookClient(info.id, info.token),
    warnWH = new Discord.WebhookClient(warn.id, warn.token),
    errorWH = new Discord.WebhookClient(error.id, error.token);

const logger = (mode) => {
    return (...args) => {
        let output = args.join(" "),
            timeFormatted = new Date().toLocaleTimeString("ru-RU", { hour12: false });

        switch (mode) {
            case 0:
                console.log(chalk.whiteBright(`[${timeFormatted} - INFO] ` + output));
                if (!config.dev) infoWH.send(`[${timeFormatted} - INFO] ` + output);
                break;
            case 1:
                console.log(chalk.yellowBright(`[${timeFormatted} - WARN] ` + output));
                if (!config.dev) warnWH.send(`[${timeFormatted} - WARN] ` + output);
                break;
            case 2:
                console.log(chalk.redBright(`[${timeFormatted} - ERROR] ` + output));
                if (!config.dev) errorWH.send(`${e}<@419892040726347776>${e} [${timeFormatted} - ERROR] ` + output);
                break;
        };
    };
};

module.exports = {
    log: logger(0),
    warn: logger(1),
    error: logger(2)
};