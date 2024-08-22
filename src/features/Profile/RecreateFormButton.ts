import type {BotClient} from '../../lib/discord/Client';
import {IFeature} from "../../lib/discord/Feature";
import {
  ActionRowBuilder,
  ButtonInteraction,
  EmbedBuilder, Message,
  ModalBuilder, type ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
  type User
} from 'discord.js'
import imgur from '../../lib/helpers/imgur'

export default class RecreateFormButton implements IFeature<ButtonInteraction> {
  name = "RecreateForm";

  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    const modal = new ModalBuilder()
      .setCustomId(`RecreateFormModal_${interaction.user.id}`)
      .setTitle('Перезаполнить анкету');
    
    const nameInput = new TextInputBuilder()
      .setCustomId('name')
      .setLabel("Как вас зовут?")
      .setRequired(true)
      .setPlaceholder('Например: Андрей')
      .setStyle(TextInputStyle.Short);
    
    const ageInput = new TextInputBuilder()
      .setCustomId('age')
      .setLabel("Сколько вам лет?")
      .setRequired(true)
      .setPlaceholder('Например: 18')
      .setStyle(TextInputStyle.Short);
    
    const cityInput = new TextInputBuilder()
      .setCustomId('city')
      .setLabel("Из какого вы города?")
      .setRequired(true)
      .setPlaceholder('Например: Москва')
      .setStyle(TextInputStyle.Short);
    
    const sexInput = new TextInputBuilder()
      .setCustomId('sex')
      .setLabel("Какой у вас пол?")
      .setRequired(true)
      .setPlaceholder('Например: Мужской')
      .setStyle(TextInputStyle.Short);
    
    const aboutInput = new TextInputBuilder()
      .setCustomId('info')
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
