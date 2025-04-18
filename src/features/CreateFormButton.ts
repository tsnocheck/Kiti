import {IFeature} from "../lib/discord/Feature";
import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from 'discord.js';

export default class CreateFormButton implements IFeature<ButtonInteraction> {
  name = "CreateFormButton";
  preconditions = ['AuthorPrecondition'];

  async run({interaction}: { interaction: ButtonInteraction }): Promise<any> {

    const modal = new ModalBuilder()
      .setCustomId(`CreateFormModal_${interaction.user.id}`)
      .setTitle('Создать анкету');

    const nameInput = new TextInputBuilder()
      .setCustomId('name')
      .setLabel("Как вас зовут?")
      .setRequired(true)
      .setPlaceholder('Андрей')
      .setStyle(TextInputStyle.Short);

    const ageInput = new TextInputBuilder()
      .setCustomId('age')
      .setLabel("Сколько вам лет?")
      .setRequired(true)
      .setPlaceholder('18')
      .setStyle(TextInputStyle.Short);

    const cityInput = new TextInputBuilder()
      .setCustomId('city')
      .setLabel("Из какого вы города?")
      .setRequired(true)
      .setPlaceholder('Москва')
      .setStyle(TextInputStyle.Short);

    const aboutInput = new TextInputBuilder()
      .setCustomId('info')
      .setLabel("Расскажите о себе")
      .setPlaceholder('Харизматичный, ищу новых друзей')
      .setStyle(TextInputStyle.Short);

    const nameActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    const ageActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(ageInput);
    const cityActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(cityInput);
    const aboutActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(aboutInput);

    modal.addComponents(nameActionRow, ageActionRow, cityActionRow, aboutActionRow);
    await interaction.showModal(modal);
  }
}
