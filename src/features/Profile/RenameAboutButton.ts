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

export default class RenameAboutButton implements IFeature<ButtonInteraction> {
  name = "RenameAbout";

  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    const modal = new ModalBuilder()
      .setCustomId(`RenameAboutModal_${interaction.user.id}`)
      .setTitle('Изменить описание');
    
    const nameInput = new TextInputBuilder()
      .setCustomId('aboutMe')
      .setLabel("Ваше новое описание:")
      .setRequired(true)
      .setPlaceholder('Например: Я крутой и харизматичный')
      .setStyle(TextInputStyle.Paragraph);
    
    const nameActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);

    modal.addComponents(nameActionRow);
    await interaction.showModal(modal);
  }
}
