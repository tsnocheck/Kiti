const { Client, Collection, Intents  } = require("discord.js");
// Import Discord.Js.
const client = new Client({
   intents: [
     Intents.FLAGS.GUILDS,
     Intents.FLAGS.GUILD_MEMBERS,
     Intents.FLAGS.GUILD_BANS,
     Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
     Intents.FLAGS.GUILD_INVITES,
     Intents.FLAGS.GUILD_VOICE_STATES,
     Intents.FLAGS.GUILD_PRESENCES,
     Intents.FLAGS.GUILD_MESSAGES,
     Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
     Intents.FLAGS.GUILD_MESSAGE_TYPING,
     Intents.FLAGS.DIRECT_MESSAGES,
     Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
     Intents.FLAGS.DIRECT_MESSAGE_TYPING,
   ],
   partials: ['MESSAGE', 'CHANNEL']
 });
// Make New Discord Client.
module.exports = client;
// Export Client To Give Other Files Access.
const chalk = require("chalk");
// Import Chalk

// ———————————————[Global Variables]———————————————
client.commands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.slashCommands = new Collection();
client.config = require("./botconfig/main.json");
require("./handler")(client);
// Initializing the project.

const mongoose = require('mongoose');
mongoose.Promise = global.Promise; 
mongoose.connect('mongodb+srv://Kitekat:Manrol1971@cluster0.vlbn9.mongodb.net/Znakomstva?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    
})
    .catch((e) => console.log('[index.js] ' + e)),console.log("есть подключение Ichigo (econom)");


// ———————————————[Logging Into Client]———————————————
const token = process.env["clienttoken"] || client.config.clienttoken;
if(token === ""){
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(
      chalk.white("["),
      chalk.red.bold("AntiCrash"),
      chalk.white("]"),
      chalk.gray(" : "),
      chalk.white.bold("Invalid Token")
   );
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(chalk.magenta("There Are 3 Ways To Fix This"));
   console.log(
      chalk.blue("Put Your ") + chalk.red("Bot Token ") + chalk.blue("in:")
   );
   console.log(
      chalk.yellow.bold("1.) ") +
         chalk.cyan("index.js") +
         chalk.gray(
            " On the client.login line remove client.login(token) and write client.login('Your token')"
         )
   );
   console.log(
      chalk.yellow.bold("2.) ") +
         chalk.cyan("ENV/Secrets") +
         chalk.gray(
            " If using replit, make new secret named 'clienttoken' and put your token in it else, if your using VsCode, Then Follow Some ENV tutorials (I don't suggest using it in VSC)"
         )
   );
   console.log(
      chalk.yellow.bold("3.) ") +
         chalk.cyan("main.json ") +
         chalk.gray(
            'Go To botconfig/main.json, Find The Line with client.token and put "client.token":"Your Bot Token"'
         )
   );
   console.log(
      chalk.green.bold("Still Need Help? Contact Me:\n") +
         chalk.yellow.italic("Discord: DrakeZee#5223\n") +
         chalk.yellow.italic("Discord Server: dsc.gg/botsway")
   );
} else {
   client.login(token);
}
// Login The Bot.
// ———————————————[Error Handling]———————————————
process.on("unhandledRejection", (reason, p) => {
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(
      chalk.white("["),
      chalk.red.bold("AntiCrash"),
      chalk.white("]"),
      chalk.gray(" : "),
      chalk.white.bold("Unhandled Rejection/Catch")
   );
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(
      chalk.white("["),
      chalk.red.bold("AntiCrash"),
      chalk.white("]"),
      chalk.gray(" : "),
      chalk.white.bold("Uncaught Exception/Catch")
   );
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(
      chalk.white("["),
      chalk.red.bold("AntiCrash"),
      chalk.white("]"),
      chalk.gray(" : "),
      chalk.white.bold("Multiple Resolves")
   );
   console.log(chalk.gray("—————————————————————————————————"));
   console.log(type, promise, reason);
});
