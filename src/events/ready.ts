import {IEvent} from "../lib/discord/Event";
import {getModelForClass} from '@typegoose/typegoose';
import {User} from '../lib/schemas/User';

export default class ReadyEvent implements IEvent {

  name = 'ready';

  async run(client: any) {
    const UserModel = getModelForClass(User);
    let guildCount = await client.guilds.fetch();

    await client.metrics.pushGuildCount(guildCount.size);
    await client.metrics.pushUserCount(UserModel.length);
  }
}
