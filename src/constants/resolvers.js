module.exports.getInvite = async (guild) => {
    const guildDB = await db.guild(guild.id);

    const channel = await guild.channels.resolve(guildDB.get().channel);
    if (!channel) return false;

    let i;

    guild.fetchInvites()
        .then(invites => {
            invites.find(invite => i = invite.inviter.id === client.user.id);
        });

    if (i) i = i.code;
    else {
        channel.createInvite({ maxAge: 0 })
            .then(inv => {
                i = inv.code;
            });
    };
    return i;
};