import {BotClient} from "./lib/discord/Client";
import {IntentsBitField} from "discord.js";
import {config} from "dotenv";

config()

const client = new BotClient()

client.build(process.env.TOKEN!)
