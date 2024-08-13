import {ApplicationCommandDataResolvable, Client, GatewayIntentBits} from "discord.js";
import {logger} from '../services/logger'
import { PrometheusClient } from '../prometheus/client'
import {ICommand} from "./Command";
import {IFeature} from "./Feature";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import {IEvent} from "./Event";
import mongoose from 'mongoose';

class BotClient extends Client {
  commands: Map<string, ICommand>;
  features: Map<string, IFeature<unknown>>;
  metrics: PrometheusClient;
  
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
      ],
    });
    this.metrics = new PrometheusClient()
    this.commands = new Map<string, ICommand>();
    this.features = new Map<string, IFeature<unknown>>();
  }

  public async build(token: string) {
    try {
      logger.info('Logging to client..')
      await super.login(token)
      logger.info('Success login to client..')
    } catch (e) {
      logger.error(e)
      process.exit(1)
    }

    try {
      await this.connectToDatabase(process.env.MONGOURI!)
    } catch (e) {
      logger.error(e)
      process.exit(1)
    }

    try {
      logger.info('Register events and commands..')
      await this.__registerCommands(path.join(__dirname, '../..', 'commands'))
      await this.__registerEvents(path.join(__dirname, '../..', 'events'))
      await this.__registerFeatures(path.join(__dirname, '../..', 'features'))
      logger.info('Successfully registered events and commands..')
    } catch (e) {
      logger.error(e)
      process.exit(1)
    }

    try {
      logger.info('Loading commands to Discord API..')
      await this.__loadCommands(process.env.MODE!)
    } catch (e) {
      logger.error('Failed to load commands to Discord API: ' + e)
    }
  }

  public async connectToDatabase(mongoUrl: string) {
    try {
      logger.info('Connecting to database...');
      await mongoose.connect(mongoUrl, { dbName: 'bot' });
      logger.info('Successfully connected to the database.');
    } catch (error) {
      logger.error(`Failed to connect to the database: ${error}`);
      process.exit(1);
    }
  };

  private async __registerCommands(commandsPath: string) {
    const dir = await fs.readdir(commandsPath)
    for (const file of dir) {
      const stat = await fs.lstat(path.join(commandsPath, file))
      if (stat.isDirectory()) {
        await this.__registerCommands(path.join(commandsPath, file))
      } else {
        if (!file.endsWith(".js")) return;
        let module: ICommand
        try {
          module = new ((await import(path.join(commandsPath, file))).default) as ICommand
        } catch (e) {
          logger.error('Failed to load command ' + path.join(commandsPath, file));
          continue;
        }
        if (module.features) {
          for (const feature of module.features) {
            this.features.set(feature.name, feature)
          }
        }
        this.commands.set(module.name, module)
      }
    }
  }

  private async __registerEvents(eventsPath: string) {
    const dir = await fs.readdir(eventsPath)
    for (const file of dir) {
      const stat = await fs.lstat(path.join(eventsPath, file))
      if (stat.isDirectory()) {
        await this.__registerEvents(path.join(eventsPath, file))
      } else {
        if (!file.endsWith(".js")) return;
        const module = new ((await import(path.join(eventsPath, file))).default) as IEvent

        this.on(module.name, (...args) => module.run(this, ...args))
      }
    }
  }

  private async __registerFeatures(featuresPath: string) {
    const dir = await fs.readdir(featuresPath)
    for (const file of dir) {
      const stat = await fs.lstat(path.join(featuresPath, file))
      if (stat.isDirectory()) {
        await this.__registerFeatures(path.join(featuresPath, file))
      } else {
        if (!file.endsWith(".js")) return;
        const module = new ((await import(path.join(featuresPath, file))).default) as IFeature<unknown>
        this.features.set(module.name, module)
      }
    }
  }

  private async __loadCommands(mode: string) {
    if(mode === 'prod') {
      await this.application!.commands.set(this.__convertCommands())
    } else {
      const guild = await this.guilds.fetch(process.env.DEV_GUILDID!);
      await guild.commands.set(this.__convertCommands())
    }
  }

  private __convertCommands(): ApplicationCommandDataResolvable[] {
    const commands: ApplicationCommandDataResolvable[] = [];

    for (const command of this.commands.values()) {
      commands.push({name: command.name, description: command.description, options: command.options || []})
    }
    return commands
  }
}

export {BotClient}
