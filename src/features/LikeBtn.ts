import {IFeature} from "../lib/discord/Feature";
import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, type User} from 'discord.js';
import {BotClient} from "../lib/discord/Client";

export default class LikeBtn implements IFeature<ButtonInteraction> {
  name = "LikeBtn";

  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    let likesForm = await client.userUsecase.findByUserId(interaction.customId.split('_')[1]);
    let form = await client.userUsecase.findByUserId(interaction.user.id);
    let likes = await client.userUsecase.getLikesForm(interaction.user.id)
    
    const member: User = await client.users.fetch(interaction.customId.split('_')[1]) as User;
    
    let emb = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription(`
        **У вас взаимная симпатия! Надеюсь хорошо проведете время ;) Начинай общаться 👉 <@${likesForm?.userId}>**
        
        ${likesForm?.name}, ${likesForm?.age}, ${likesForm?.city}
        ${likesForm?.status}
      `)
      .setColor(0x2b2d31)
      .setImage(likesForm?.photo || null);
    
    let userRow = new ActionRowBuilder<ButtonBuilder>() //чел который лайкнул через /like
    let likesRow = new ActionRowBuilder<ButtonBuilder>() //чел который лайкнул через /find
    
    let button = new ButtonBuilder()
      .setURL(`https://discord.com/users/${likesForm?.userId}`)
      .setEmoji('<:sendIcon:1275114387786694749>')
      .setStyle(ButtonStyle.Link)
    
    userRow.addComponents(button)
    
    await interaction.deferUpdate()
    await interaction.editReply({embeds:[emb], components:[userRow]})
    
    button.setURL(`https://discord.com/users/${interaction.user.id}`)
    likesRow.addComponents(button)
    
    emb
      .setDescription(`
        **У вас взаимная симпатия! Надеюсь хорошо проведете время ;) Начинай общаться 👉 <@${form?.userId}>**
        
        ${form?.name}, ${form?.age}, ${form?.city}
        ${form?.status}
      `)
      .setImage(form?.photo || null);
    
    await member?.send({embeds:[emb], components:[likesRow]})
    await client.userUsecase.deleteLikedToForm(likesForm?._id, interaction.user.id)
    
    if(!likes?.likedTo || likes.likedTo.length === 0) {
      await interaction.followUp({content:'К сожалению анкеты кончились, попробуйте позже', ephemeral:true})
    }else{
      let likedToForm = await client.userUsecase.getFormForObjectId(likes?.likedTo[0])
      
      let embed = new EmbedBuilder()
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
      
      await interaction.followUp({embeds:[embed], components:[button]})
    }
  }
}
