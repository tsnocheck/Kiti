import type {BotClient} from '../lib/discord/Client';
import {IPrecondition} from "../lib/discord/Precondition";
import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  RepliableInteraction
} from 'discord.js';

export default class AppealForm implements IPrecondition {
  name = 'AppealForm';

  async run({interaction, client}: { interaction: BaseInteraction, client: BotClient }) {
    let user = await client.userUsecase?.findByUserId(interaction.user.id);
    if (user?.banned) {
      let button = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('CreateAppealFormButton')
            .setLabel('Подать апелляцию')
            .setStyle(ButtonStyle.Success)
        );

      let embed = new EmbedBuilder()
        .setTitle('Анкета')
        .setColor(0x2b2d31)
        .setDescription('**К сожалению ваша анкета находится в бане, но вы можете подать апелляцию на разбан.**');
      await (interaction as RepliableInteraction).reply({embeds: [embed], components: [button], fetchReply: true});
      return false;
    }else{
      return true;
    }
  }
}
