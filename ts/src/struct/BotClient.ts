/* eslint-disable prettier/prettier */
import { Client, Collection } from 'discord.js';
import { ClientOptions } from 'discord.js';
import { Command } from './Command';
import { readdir, lstat } from 'fs/promises';
import { join } from 'path';

export class BotClient extends Client {
  commands: Collection<string, Command>;

  constructor(options: ClientOptions) {
    super(options);

    this.commands = new Collection<string, Command>();
  }
  private async loadCommands(){}

  protected async registerCommands(...dirs: string[]) {
    for (const dir of dirs) {
      const files = await readdir(join(__dirname, dir));

      for (const file of files) {
        const stat = await lstat(join(__dirname, dir, file));
        if (stat.isDirectory()) await this.registerCommands(join(dir, file));
        else {
          if (file.endsWith('.js')) {
            try {
              // const module: Command = new (
              //     await import(join(__dirname, dir, file))
              // ).default(this);
              const commandModule = await import(join(__dirname, dir, file));
              const command = new commandModule.default(this) as Command;
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

  public async start(token: string) {
    await super.login(token);
  }
}
