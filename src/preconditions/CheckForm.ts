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

export default class CheckForm implements IPrecondition {
  name = 'CheckForm';

  async run({interaction, client}: { interaction: BaseInteraction, client: BotClient }) {
    let user = await client.userUsecase?.findByUserId(interaction.user.id);
    
    if (user == null) {
      let button = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('CreateFormButton')
            .setLabel('Создать анкету')
            .setStyle(ButtonStyle.Success)
        );

      let embed = new EmbedBuilder()
        .setTitle('Анкета')
        .setColor('#bbffd3')
        .setDescription('**Создавая анкету вы автоматически подписываете [Пользовательское соглашение](https://docs.google.com/document/d/1pnNdL2rUVqurlKscDZNy-ABdPw-ZfDdQXOlo6kwnxvM) и [Политику конфиденциальности](https://docs.google.com/document/d/1IVsThKB01CVMeXI551f5LfdV-ICi0-1_ydPyNukVB3c)**');
      await (interaction as RepliableInteraction).reply({embeds: [embed], components: [button]});
      return false;
    }else{
      return true;
    }
  }
}
