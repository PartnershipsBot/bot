const
    chalk = require("chalk"),
    Discord = require("discord.js"),
    { info, warn, error } = require("../../config").loggers,
    e = "<a:fuck:868103266662232124>";
const
    infoWH = new Discord.WebhookClient(info.id, info.token),
    warnWH = new Discord.WebhookClient(warn.id, warn.token),
    errorWH = new Discord.WebhookClient(error.id, error.token);

module.exports = {
    log: (content) => {
        console.log(chalk.whiteBright(`[${timeFormatted} - INFO] ` + content));
        infoWH.send(`[${timeFormatted} - INFO] ` + content);
    },
    warn: (content) => {
        console.log(chalk.yellowBright(`[${timeFormatted} - INFO] ` + content));
        warnWH.send(`[${timeFormatted} - INFO] ` + content);
    },
    error: (content) => {
        console.log(chalk.redBright(`[${timeFormatted} - INFO] ` + content));
        errorWH.send(`${e}<@419892040726347776>${e}[${timeFormatted} - INFO] ` + content);
    },
};