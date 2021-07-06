module.exports = {
  	description: "Run JavaScript code. This is DANGEROUS, so only use it if you know what you're doing. Never run any code from people you don't trust.",
  	usage: {
    	"<код>": "JavaScript код."
  	},
  	examples: {},
  	aliases: [ "evaluate" ],
  	permissionRequired: 4, // 0 All, 1 Admins, 2 Server Owner, 3 Bot Admin, 4 Bot Owner
  	checkArgs: (args) => !!args.length
};

module.exports.run = async (message, args) => {
  	try {
    	let evaled = eval(args.join(' '));
    	if (typeof evaled != "string") evaled = require("util").inspect(evaled);
    	return message.channel.send(evaled, { code: "js" });
  	} catch(e) {
    	let error = e;
    	if (typeof e == "string") error = e.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    	return message.channel.send(e.stack, { code: "fix" });
  	};
};