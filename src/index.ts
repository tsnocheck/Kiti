import {BotClient} from "./lib/discord/Client";
import {config} from "dotenv";

config();

const client = new BotClient();

client.build(process.env.TOKEN!);
