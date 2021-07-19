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