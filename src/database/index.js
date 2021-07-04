const config = require('../../config'), mongoose = require('mongoose');

module.exports = (client) => {
    if (typeof config.database_uri !== 'string') throw new Error('Please enter a valid DataBase URI');
    mongoose.connect(config.database_uri, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).catch(e => {
        console.log(e);
        client.shard.send('respawn');
    });

    return {
        guild: require('./guild'), // guild(guildid)
        cacheGuilds: require('./guild').cacheAll
    };
};