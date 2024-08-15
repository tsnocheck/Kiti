import { IFeature } from "../lib/discord/Feature";
import {
  ButtonInteraction,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
  type ModalActionRowComponent, type ModalActionRowComponentBuilder
} from 'discord.js'

export default class createFormFeature implements IFeature<ButtonInteraction> {
  name = "createForm";
  preconditions = ['AuthorPrecondition'];
  
  async run({ interaction }: { interaction: ButtonInteraction }): Promise<any> {
    
    const modal = new ModalBuilder()
      .setCustomId(`createForm_${interaction.user.id}`)
      .setTitle('Создать анкету');

    const nameInput = new TextInputBuilder()
      .setCustomId('nameModal')
      .setLabel("Как вас зовут?")
      .setRequired(true)
      .setPlaceholder('Например: Андрей')
      .setStyle(TextInputStyle.Short);
    
    const ageInput = new TextInputBuilder()
      .setCustomId('ageModal')
      .setLabel("Сколько вам лет?")
      .setRequired(true)
      .setPlaceholder('Например: 18')
      .setStyle(TextInputStyle.Short);
    
    const cityInput = new TextInputBuilder()
      .setCustomId('cityModal')
      .setLabel("Из какого вы города?")
      .setRequired(true)
      .setPlaceholder('Например: Москва')
      .setStyle(TextInputStyle.Short);
    
    const sexInput = new TextInputBuilder()
      .setCustomId('sexModal')
      .setLabel("Какой у вас пол?")
      .setRequired(true)
      .setPlaceholder('Например: Мужской')
      .setStyle(TextInputStyle.Short);
    
    const aboutInput = new TextInputBuilder()
      .setCustomId('aboutModal')
      .setLabel("Расскажите о себе")
      .setPlaceholder('Например: Харизматичный, ищу новых друзей')
      .setStyle(TextInputStyle.Short);
    
    const nameActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    const ageActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(ageInput);
    const cityActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(cityInput);
    const sexActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(sexInput);
    const aboutActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(aboutInput);
    
    modal.addComponents(nameActionRow, ageActionRow, cityActionRow, sexActionRow, aboutActionRow);
    await interaction.showModal(modal);
  }
}
