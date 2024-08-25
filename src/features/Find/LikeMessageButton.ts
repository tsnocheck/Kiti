import {IFeature} from "../../lib/discord/Feature";
import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from 'discord.js';
import {BotClient} from "../../lib/discord/Client";

export default class MessageLikeButton implements IFeature<ButtonInteraction> {
  name = "MessageLikeButton";

  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    const id = interaction.customId.split('_')[1];
    const modal = new ModalBuilder()
      .setCustomId(`LikeMessageModal_${id}`)
      .setTitle('Анкета');
    
    const nameInput = new TextInputBuilder()
      .setCustomId('message')
      .setLabel("Сообщение пользователю:")
      .setRequired(true)
      .setPlaceholder('Приветик, красивое фото')
      .setStyle(TextInputStyle.Paragraph);
    
    const nameActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    
    modal.addComponents(nameActionRow);
    await interaction.showModal(modal);
  }
}
