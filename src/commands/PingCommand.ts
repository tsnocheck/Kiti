import {ICommand} from "../lib/discord/Command";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder
} from 'discord.js'
import { UserUsecase } from '../lib/usecases/UserUsecase'

export default class PingCommand implements ICommand {
  name = 'find';
  description = 'Поиск анкет';
  preconditions = ['NicknamePrecondition']

  async run({interaction}: { interaction: CommandInteraction }) {
    let usecases = new UserUsecase()
    let form = await usecases.getRandomForm()

    let embed = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription(`
        ${form?.name}, ${form?.age}, ${form?.city}
        ${form?.status}
      `)
      .setColor(0x2b2d31)
      .setImage(form?.photo || null)
    
    const buttons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`LikeButton_${form?.userId}`)
          .setEmoji('<:likeMessageIcon:1273558952235241557>')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`MessageLikeButton_${form?.userId}`)
          .setEmoji('<:likeIcon:1273558975966744620>')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`DisLikeButton_${form?.userId}`)
          .setEmoji('<:dislikeIcon:1273559004014055497>')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`ReportButton_${form?.userId}`)
          .setEmoji('<:ticketIcon:1273559224940494858>')
          .setStyle(ButtonStyle.Secondary),
      )
    await interaction.reply({embeds:[embed],components:[buttons]})
  }
}
