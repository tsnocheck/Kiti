import {ApplicationCommandDataResolvable, Client, GatewayIntentBits} from "discord.js";
import {logger} from '../services/logger'
import {PrometheusClient} from '../prometheus/client'
import {ICommand} from "./Command";
import {IFeature} from "./Feature";
import * as path from "node:path";
import mongoose from 'mongoose';
import {createClient, RedisClientType} from "redis";
import {Registry} from "./Registry";
import {IPrecondition} from "./Precondition";
import * as process from "node:process";
import { UserUsecase } from '../usecases/UserUsecase'

class BotClient extends Client {
  commands: Map<string, ICommand>;
  features: Map<string, IFeature<unknown>>;
  preconditions: Map<string, IPrecondition>
  registry: Registry;
  metrics: PrometheusClient;
  redis?: RedisClientType;
  usercases?: UserUsecase;
  
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
    this.preconditions = new Map<string, IPrecondition>();
    this.registry = new Registry(this);
    this.redis = undefined;
    this.usercases = new UserUsecase();
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
      logger.info('Connecting to redis..')
      this.redis = createClient({
        url: `redis://redis:6379/0`
      })
      await this.redis.connect()
      logger.info('Success connect to redis..')
    } catch (e) {
      logger.error(`Failed connect to redis... ${e}`)
      process.exit(1)
    }

    try {
      logger.info('Register events and commands..')
      await this.registry.registerCommands(path.join(__dirname, '../..', 'commands'))
      await this.registry.registerEvents(path.join(__dirname, '../..', 'events'))
      await this.registry.registerFeatures(path.join(__dirname, '../..', 'features'))
      await this.registry.registerPreconditions(path.join(__dirname, '../..', 'preconditions'))
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
      await mongoose.connect(mongoUrl, {dbName: 'bot'});
      logger.info('Successfully connected to the database.');
    } catch (error) {
      logger.error(`Failed to connect to the database: ${error}`);
      process.exit(1);
    }
  };

  private async __loadCommands(mode: string) {
    if (mode === 'prod') {
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
