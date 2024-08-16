import type {BotClient} from '../lib/discord/Client';
import {IPrecondition} from "../lib/discord/Precondition";
import {BaseInteraction, RepliableInteraction} from 'discord.js';

export default class AuthorPrecondition implements IPrecondition {
  name = 'AuthorPrecondition';

  async run({interaction, client}: { interaction: BaseInteraction, client: BotClient }) {
    let user = await client.usercases?.findByUserId(interaction.user.id);

    if (interaction.isMessageComponent()) {
      if (interaction.message.interaction?.user.id != interaction.user.id) {
        await (interaction as RepliableInteraction).reply({content: 'Не ваше меню', ephemeral: true});
        return false;
      }
    }
    return true;
  }
}
