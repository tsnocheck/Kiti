import {IFeature} from "../../lib/discord/Feature";
import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from 'discord.js';

export default class CreateAppealFormButton implements IFeature<ButtonInteraction> {
  name = "CreateAppealFormButton";
  preconditions = ['AuthorPrecondition'];

  async run({interaction}: { interaction: ButtonInteraction }): Promise<any> {

    const modal = new ModalBuilder()
      .setCustomId(`CreateAppealModal_${interaction.user.id}`)
      .setTitle('Подать апелляцию');

    const appealInput = new TextInputBuilder()
      .setCustomId('appealText')
      .setLabel("Текст апелляции")
      .setRequired(true)
      .setPlaceholder('Например: Меня забанили по случайности')
      .setStyle(TextInputStyle.Paragraph);
    
    const appealActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(appealInput);
    
    modal.addComponents(appealActionRow);
    await interaction.showModal(modal);
  }
}
