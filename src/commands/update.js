module.exports = {
    description: "Pull the latest commit from Github.",
    usage: {},
    examples: {},
    aliases: ["upd", "u"],
    permissionRequired: 3, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
    checkArgs: (args) => !args.length
};

const { exec } = require('child_process');

module.exports.run = async (message) => {
    exec("git stash push --include-untracked");
    exec("git pull origin main", (error, stdout) => {
        exec("git stash drop");
    	let res = (error || stdout);
        if (error) return message.reply(error, { code: "fix" });
        if (res.includes("Already up to date.")) {
            message.reply("Bot already up to date. No changes since last pull.");
        } else {
            message.reply("Pulled from GitHub. Restarting the bot.\n\nLogs:\n```" + res + "```")
                .then(() => setTimeout(() => process.exit(), 1000));
        };
	});
};