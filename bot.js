const Discord = require("discord.js");
const client = new Discord.Client();
const moment = require("moment");
const express = require("express");
const app = express();
const ayarlar = require("./db/botayar.json");
const fs = require("fs");
const urllib = require("urllib");
const reqEvent = event => require(`./events/${event}.js`);
require("./util/eventLoader.js")(client);
app.get("/", (request, response) => {
    response.sendStatus(200);
});
app.listen(process.env.PORT);

setInterval(() => {
    urllib.request('https://amadeusu.herokuapp.com');
}, 1000);
const log = message => {
    console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut y�klenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Y�klenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});

client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    if (message.author.id === ayarlar.sahip) permlvl = 11;
    return permlvl;
};

client.login(ayarlar.token);