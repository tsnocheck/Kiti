/* eslint-disable prettier/prettier */
import { ApplicationCommandData, Client, Collection } from 'discord.js';
import { ClientOptions } from 'discord.js';
import { Command } from './Command';
import { readdir, lstat } from 'fs/promises';
import { join } from 'path';
import { Feature } from './Feature';

export class BotClient extends Client {
  commands: Collection<string, Command>;
  features: Collection<string, Feature>;
  config: Config;

  constructor(options: ClientOptions, config: Config) {
    super(options);

    this.commands = new Collection<string, Command>();
    this.features = new Collection<string, Feature>();
    this.config = config;
  }

  private async loadCommands() {
    const commands = this.commands.values();
    const devCommands: object[] = [];
    const globalCommands: object[] = [];
    for (const command of commands) {
      if(command.development)
        devCommands.push(commandToJson(command))
      else
        globalCommands.push(commandToJson(command))
    }

   const guild = await this.guilds.fetch(this.config.devGuildId);
    // TODO: потипоебить и пофиксить это
    await guild.commands.set(devCommands);
  }

  protected async registerCommands(...dirs: string[]) {
    for (const dir of dirs) {
      const files = await readdir(join(__dirname, dir));

      for (const file of files) {
        const stat = await lstat(join(__dirname, dir, file));
        if (stat.isDirectory()) await this.registerCommands(join(dir, file));
        else {
          if (file.endsWith('.js')) {
            try {
              const module = await import(join(__dirname, dir, file));
              const command = new module.default(this) as Command;
              if(!command.name || !command.description) {
                console.log(`Недостаточно полей для регистрации команды ${file}`);
                continue;
              }
              this.commands.set(command.name, command);
            } catch (e) {
              console.log(
                `Ошибка при загрузке команды из файла ${file}: \n${e}`,
              );
            }
          }
        }
      }
    }
  }

  protected async registerFeatures(...dirs: string[]) {

  }

  public async start(token: string) {
    await super.login(token);
  }
}

function commandToJson(command: Command): ApplicationCommandData {
  return {
    'name': command.name,
    'description': command.description,
    // TODO: надо дописать чтобы он переводил ApplicationCommandOption в ApplicationCommandOptionData
    'options': command.options?.map(i => i.),
    'default_member_permissions': command.permissions
  }
}

export interface Config {
  devGuildId: string;
  dbUrl: string;
}
