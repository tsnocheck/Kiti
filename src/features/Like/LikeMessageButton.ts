import {IFeature} from "../../lib/discord/Feature";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder, TextInputBuilder, TextInputStyle,
  type User
} from 'discord.js'
import {BotClient} from "../../lib/discord/Client";

export default class MessageLikeButton implements IFeature<ButtonInteraction> {
  name = "MessageLikeButton";

  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    const modal = new ModalBuilder()
      .setCustomId(`LikeMessageModal_${interaction.user.id}`)
      .setTitle('Анкета');
    
    const nameInput = new TextInputBuilder()
      .setCustomId('message')
      .setLabel("Сообщение пользователю:")
      .setRequired(true)
      .setPlaceholder('Например: Приветик, красивое фото')
      .setStyle(TextInputStyle.Paragraph);
    
    const nameActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    
    modal.addComponents(nameActionRow);
    await interaction.showModal(modal);
  }
}
