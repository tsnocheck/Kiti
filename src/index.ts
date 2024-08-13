import { createClient, type RedisClientType } from 'redis'
import {BotClient} from "./lib/discord/Client";
import {config} from "dotenv";
config()

const redis: RedisClientType = createClient({
  url: 'redis://root:admin@redis:6379'
})

const client = new BotClient(redis)

client.build(process.env.TOKEN!)
