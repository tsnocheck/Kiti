import type {BotClient} from '../../lib/discord/Client';
import {IFeature} from "../../lib/discord/Feature";
import {
  ActionRowBuilder,
  ButtonInteraction,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  type User
} from 'discord.js'

export default class RenameYearButton implements IFeature<ButtonInteraction> {
  name = "RenameYear";

  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    const modal = new ModalBuilder()
      .setCustomId(`RenameYearModal_${interaction.user.id}`)
      .setTitle('Изменить возраст');
    
    const nameInput = new TextInputBuilder()
      .setCustomId('year')
      .setLabel("Ваше новый возраст:")
      .setRequired(true)
      .setPlaceholder('18')
      .setStyle(TextInputStyle.Paragraph);
    
    const nameActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);

    modal.addComponents(nameActionRow);
    await interaction.showModal(modal);
  }
}
