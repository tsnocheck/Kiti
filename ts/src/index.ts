import { config } from 'dotenv';
import { BotClient } from "./class/BotClient";

config();

export const client: BotClient = new BotClient();

client.loadCommands();
client.loadEvents();
client.start();
client.deployCommands();
client.loadModules();
client.connectDb();