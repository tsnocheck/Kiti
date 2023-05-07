import { Command } from '../struct/Command';

export default class PingCommand extends Command {
  constructor() {
    super({
      name: 'ping',
      description: 'pong',
    });
  }
}
