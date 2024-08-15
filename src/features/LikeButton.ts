import { IFeature } from "../lib/discord/Feature";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js'
import { UserUsecase } from '../lib/usecases/UserUsecase'

export default class ButtonFeature implements IFeature<ButtonInteraction> {
  name = "LikeButton";
  
  async run({ interaction }: { interaction: ButtonInteraction }): Promise<any> {
    let usercases = new UserUsecase()
    let status = await usercases.like(interaction.customId.split('_')[1], interaction.user.id)
    if(status){
      let form = await usercases.getRandomForm()
      
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
      await interaction.update({embeds:[embed],components:[buttons]})
      await interaction.followUp({content:'Вы успешно лайкнули анкету', ephemeral:true})
    }
  }
}
