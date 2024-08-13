import {BotClient} from "./lib/discord/Client";
import {config} from "dotenv";
import { createClient } from 'redis'

config()

const redis = createClient({
  url: 'redis://root:admin@redis:6379'
});

const client = new BotClient(redis)

client.build(process.env.TOKEN!)
