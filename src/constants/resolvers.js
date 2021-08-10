module.exports.getInvite = async (guild, gdb) => {
    if (!gdb) guildDB = await db.guild(guild.id);
    else guildDB = gdb;

    const channel = await guild.channels.resolve(guildDB.get().channel);
    if (!channel) return false;

    return channel.createInvite({ maxAge: 0 }).then(inv => { return inv.code;});
};