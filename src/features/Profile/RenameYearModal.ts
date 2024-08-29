import type {BotClient} from '../../lib/discord/Client';
import {IFeature} from "../../lib/discord/Feature";
import {EmbedBuilder, type ModalSubmitInteraction} from 'discord.js';

export default class RenameYearModal implements IFeature<ModalSubmitInteraction> {
  name = "RenameYearModal";

  async run({interaction, client}: { interaction: ModalSubmitInteraction, client: BotClient }): Promise<any> {
    const year = interaction.fields.getTextInputValue('year');
    await interaction.deferUpdate();
    if (isNaN(parseInt(year)) || parseInt(year) < 18) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Анкета')
            .setDescription('Указанный возраст является некорректным. Укажите число, больше 18.')
            .setColor('#ffbbbb')
        ], components: []
      });
      return;
    }
    const age = Math.max(18, parseInt(year));
    
    await client.userUsecase.renameYear(interaction.user.id, age)
    
    await interaction.editReply({
      embeds:[
        new EmbedBuilder()
          .setTitle('Анкета')
          .setDescription('Вы успешно обновили ваш возраст.')
          .setColor('#bbffd3')
      ], components:[]
    })
  }
}
