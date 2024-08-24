import type {BotClient} from '../../lib/discord/Client';
import {IFeature} from "../../lib/discord/Feature";
import {
  ActionRowBuilder,
  ButtonInteraction,
  EmbedBuilder,
  ModalBuilder, type ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
  type User
} from 'discord.js'

export default class RenameYearModal implements IFeature<ModalSubmitInteraction> {
  name = "RenameYearModal";

  async run({interaction, client}: { interaction: ModalSubmitInteraction, client: BotClient }): Promise<any> {
    const year = interaction.fields.getTextInputValue('year');
    const age = Math.min(Math.max(18, isNaN(parseInt(year)) ? 18 : parseInt(year)), 70)
    
    await client.userUsecase.renameYear(interaction.user.id, age)
    
    await interaction.deferUpdate()
    await interaction.editReply({
      embeds:[
        new EmbedBuilder()
          .setTitle('Анкета')
          .setDescription('Вы успешно обновили ваш возраст.')
          .setColor('#bbffd3')
      ]
    })
  }
}
