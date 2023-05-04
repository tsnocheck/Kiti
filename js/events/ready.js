const client = require("../index");
const chalk = require("chalk");
const { version: discordjsVersion } = require("discord.js");
const { prefix, TestingServerID } = require("../botconfig/main.json");
const main_json = require("../botconfig/main.json");
const cron = require('node-cron');
const User = require('../user.js');
client.on("ready", async () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      await Guild.updateMany({}, { visiting: [] });
      console.log('Visiting array cleared for all guilds');
    } catch (err) {
      console.error(`Error clearing visiting array: ${err}`);
    }
  });
});