import { Client, Collection } from 'discord.js';
import { ClientOptions } from 'discord.js';
import { Command } from './Command';

export class BotClient extends Client {
  commands: Collection<string, Command>;

  constructor(options: ClientOptions) {
    super(options);

    this.commands = new Collection<string, Command>();
  }

  public async start(token: string) {
    await super.login(token);
  }
}
