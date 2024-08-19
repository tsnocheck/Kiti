import {IFeature} from "../lib/discord/Feature";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js'
import {BotClient} from "../lib/discord/Client";

export default class DislikeBtn implements IFeature<ButtonInteraction> {
  name = "DislikeBtn";

  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    const likesForm = await client.userUsecase.getFormForUserId(interaction.customId.split('_')[1])
    const likes = await client.userUsecase.getLikesForm(interaction.user.id)
    
    await client.userUsecase.deleteLikedToForm(likesForm?._id, interaction.user.id)
    
    if(!likes?.likedTo || likes.likedTo.length === 0) {
      await interaction.update({components:[]})
      await interaction.followUp({content:'К сожалению анкеты кончились, попробуйте позже', ephemeral:true})
    }else{
      const likedToForm = await client.userUsecase.getFormForObjectId(likes?.likedTo[0])
      
      const embed = new EmbedBuilder()
        .setTitle('Анкета')
        .setDescription(`
        **Вас лайкнул пользователь:**
      
        ${likedToForm?.name}, ${likedToForm?.age}, ${likedToForm?.city}
        ${likedToForm?.status}
      `)
        .setColor(0x2b2d31)
        .setImage(likedToForm?.photo || null);
      
      let button = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`LikeBtn_${likedToForm?.userId}`)
            .setEmoji('<:likeIcon:1273558975966744620>')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`DislikeBtn_${likedToForm?.userId}`)
            .setEmoji('<:dislikeIcon:1273559004014055497>')
            .setStyle(ButtonStyle.Danger),
        )
      
      await interaction.update({embeds:[embed], components:[button]})
    }
  }
}
