import {IEvent} from "../lib/discord/Event";
import { getModelForClass } from '@typegoose/typegoose'
import { Form } from '../lib/schemas/Form'
import { User } from '../lib/schemas/User'

export default class ReadyEvent implements IEvent {

  name = 'ready'

  async run(client: any) {
    const UserModel = getModelForClass(User);
    const FormModel = getModelForClass(Form);
    let guildCount = await client.guilds.fetch()
    
    await client.metrics.pushGuildCount(guildCount.size)
    await client.metrics.pushUserCount(UserModel.length)
    await client.metrics.pushFormCount(FormModel.length)
  }
}
