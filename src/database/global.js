const mongoose = require("mongoose");

const dbCache = new Map();

const globalObject = {
    maintenance: false,
    blacklistedUsers: [],
    blacklistedServers: []
};

const globalSchema = mongoose.Schema(JSON.parse(JSON.stringify(globalObject)), { minimize: true });
const Global = mongoose.model("Global", globalSchema);

const get = () => new Promise((resolve, reject) => Global.findOne({}, (err, global) => {
    if (err) return reject(err);
    if (!global) {
        global = new Global(JSON.parse(JSON.stringify(globalObject)));
    };
    return resolve(global);
}));

const save = async (changes) => {
    dbSaveQueue.set("global", changes);
    let global = await get(), globalCache = dbCache.get("global"), globalSaveQueue = JSON.parse(JSON.stringify(dbSaveQueue.get("global")));
    for (const key of globalSaveQueue) global[key] = globalCache[key];
    return global.save().then(() => {
        let newSaveQueue = dbSaveQueue.get("global");
        if (newSaveQueue.length > globalSaveQueue.length) {
            dbSaveQueue.delete("global");
            save("global", newSaveQueue.filter(key => !globalSaveQueue.includes(key)));
        } else dbSaveQueue.delete("global");
    }).catch(console.log);
};

module.exports = {
    get: () => Object.assign({}, dbCache.get()),
    set: (key, value) => {
        dbCache.get()[key] = value;
        save([key]);
    },
    setMultiple: (changes) => {
        let globalCache = dbCache.get();
        Object.assign(globalCache, changes);

        save(Object.keys(changes));
    },
    addToArray: (array, value) => {
        dbCache.get()[array].push(value);
        save([array]);
    },
    removeFromArray: (array, value) => {
        dbCache.get()[array] = dbCache.get()[array].filter(aValue => aValue !== value);
        save([array]);
    },
    setOnObject: (object, key, value) => {
        dbCache.get()[object][key] = value;
        save([object]);
    },
    removeFromObject: (object, key) => {
        delete dbCache.get()[object][key];
        save([object]);
    }
};