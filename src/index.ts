import {BotClient} from "./lib/discord/Client";
import {IntentsBitField} from "discord.js";
import {config} from "dotenv";

config()

const client = new BotClient({
    intents: [IntentsBitField.Flags.Guilds]
})

client.build(process.env.TOKEN!)
