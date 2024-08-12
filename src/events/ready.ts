import {IEvent} from "../lib/discord/Event";

export default class ReadyEvent implements IEvent {

  name = 'ready'

  run(client: any) {
    console.log(`Logged in as ${client.user.tag}!`);
  }
}
