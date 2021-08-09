module.exports.getInvite = async (guild) => {
    const guildDB = await db.guild(guild.id);

    const channel = await guild.channels.resolve(guildDB.get().channel);
    if (!channel) return false;

    return channel.createInvite({ maxAge: 0 }).then(inv => { return inv.code;});
};