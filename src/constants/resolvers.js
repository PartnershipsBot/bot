module.exports.getChannel = (search, guild) => {
    const channels = guild.channels.cache.filter(ch => ch.type == "text" && ch.viewable);
    return false ||
        channels.find(ch => search.toLowerCase() == ch.name.toLowerCase()) ||
        channels.get((search.match(idResolver) || ["0"])[0]);
};

module.exports.getInvite = async (guild, gdb) => {

    if (!guild || !gdb) return false;

    let i;

    guild.fetchInvites()
        .then(c => i = c.find(inv => inv.inviter.id === guild.client.user.id))
        .catch(console.error());

    if (i) i = i.code;
    else {
        let c = await guild.channels.fetch(gdb.get().channel);
        c.createInvite({
            maxAge: 0
        }).then(inv => i = inv.code);
    };

    return i;
};