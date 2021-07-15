module.exports.getChannel = (search, guild) => {
    const channels = guild.channels.cache.filter(ch => ch.type == "text" && ch.viewable);
    return false ||
        channels.find(ch => search.toLowerCase() == ch.name.toLowerCase()) ||
        channels.get((search.match(idResolver) || ["0"])[0]);
};