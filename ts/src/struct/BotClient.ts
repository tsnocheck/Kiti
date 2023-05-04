import * as Discord from 'discord.js';
import { ClientOptions } from 'discord.js';

export class BotClient extends Discord.Client {
  constructor(options: ClientOptions) {
    super(options);
  }

  public async start(token: string) {
    await super.login(token);
  }
}
