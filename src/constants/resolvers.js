module.exports.getChannel = (search, guild) => {
    const channels = guild.channels.cache.filter(ch => ch.type == "text" && ch.viewable);
    return false ||
        channels.find(ch => search.toLowerCase() == ch.name.toLowerCase()) ||
        channels.get((search.match(idResolver) || ["0"])[0]);
};

module.exports.getInvite = async (guild, gdb) => {

    if (!guild || !gdb) return null;

    let i;

    guild.fetchInvites()
        .then(invites => {
            invites.find(invite => i = invite.inviter.id === guild.client.user.id);
        });

    if (i) i = i.code;
    else {
        const channel = await guild.channels.resolve(gdb.get().channel);
        return channel.createInvite({ maxAge: 0 })
            .then(inv => {
                return inv.code;
            });
    };
};