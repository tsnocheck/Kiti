import {IFeature} from "../../lib/discord/Feature";
import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, type User} from 'discord.js';
import {BotClient} from "../../lib/discord/Client";

export default class LikeBtn implements IFeature<ButtonInteraction> {
  name = "LikeBtn";

  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    let likedByUser = await client.userUsecase.findByUserId(interaction.customId.split('_')[1]);
    let author = await client.userUsecase.findByUserId(interaction.user.id);

    const member: User = await client.users.fetch(interaction.customId.split('_')[1]) as User;
    
    let emb = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription(`
        **У вас взаимная симпатия! Надеюсь хорошо проведете время ;) Начинай общаться 👉 <@${likedByUser?.userId}>**
        
        ${likedByUser?.name}, ${likedByUser?.age}, ${likedByUser?.city}
        ${likedByUser?.status}
      `)
      .setColor('#bbffd3')
      .setImage(likedByUser?.photo || null);
    
    let userRow = new ActionRowBuilder<ButtonBuilder>() //чел который лайкнул через /like
    let likesRow = new ActionRowBuilder<ButtonBuilder>() //чел который лайкнул через /find
    
    let button = new ButtonBuilder()
      .setURL(`https://discord.com/users/${likedByUser?.userId}`)
      .setEmoji('<:sendIcon:1275114387786694749>')
      .setStyle(ButtonStyle.Link)
    
    userRow.addComponents(button)
    
    await interaction.deferUpdate()
    await interaction.editReply({embeds:[emb], components:[userRow]})
    
    button.setURL(`https://discord.com/users/${interaction.user.id}`)
    likesRow.addComponents(button)
    
    emb
      .setDescription(`
        **У вас взаимная симпатия! Надеюсь хорошо проведете время ;) Начинай общаться 👉 <@${author?.userId}>**
        
        ${author?.name}, ${author?.age}, ${author?.city}
        ${author?.status}
      `)
      .setImage(author?.photo || null);
    
    await member?.send({embeds:[emb], components:[likesRow]})
    await client.userUsecase.addViewed(interaction.user.id, likedByUser!.userId);
    const authorLikes = await client.userUsecase.deleteLikedByForm(likedByUser!.userId, interaction.user.id);

    if (!authorLikes?.likedBy || authorLikes.likedBy.length === 0) {
      await interaction.followUp({
        content: 'К сожалению анкеты кончились, попробуйте позже',
        ephemeral: true
      });
    }else{
      let likedToForm = await client.userUsecase.getFormForObjectId(authorLikes?.likedBy[0]._id);
      
      let embed = new EmbedBuilder()
        .setTitle('Анкета')
        .setDescription(`
        **Вас лайкнул пользователь:**
      
        ${likedToForm?.name}, ${likedToForm?.age}, ${likedToForm?.city}
        ${likedToForm?.status}
      `)
        .setColor('#bbffd3')
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

      await interaction.followUp({embeds: [embed], components: [button]});
    }
  }
}
