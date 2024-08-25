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

export default class RenameAboutModal implements IFeature<ModalSubmitInteraction> {
  name = "RenameAboutModal";

  async run({interaction, client}: { interaction: ModalSubmitInteraction, client: BotClient }): Promise<any> {
    const aboutMe = interaction.fields.getTextInputValue('aboutMe');
    await client.userUsecase.renameAbout(interaction.user.id, aboutMe)
    
    await interaction.deferUpdate()
    await interaction.editReply({
      embeds:[
        new EmbedBuilder()
          .setTitle('Анкета')
          .setDescription('Вы успешно обновили информацию о себе.')
          .setColor('#bbffd3')
      ], components:[]
    })
  }
}
