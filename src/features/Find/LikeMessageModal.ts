import {IFeature} from "../../lib/discord/Feature";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type ModalSubmitInteraction,
  type User
} from 'discord.js';
import {BotClient} from "../../lib/discord/Client";

export default class LikeMessageModal implements IFeature<ModalSubmitInteraction> {
  name = "LikeMessageModal";

  async run({interaction, client}: { interaction: ModalSubmitInteraction, client: BotClient }): Promise<any> {
    const message = interaction.fields.getTextInputValue('message');
    await interaction.deferReply();
    const userForm = await client.userUsecase.findByUserId(interaction.user.id)
    
    if(!userForm?.shadowBanned){
      await client.userUsecase.like(interaction.user.id, interaction.customId.split('_')[1]);
      await client.userUsecase.likeMessage(interaction.user.id, interaction.customId.split('_')[1], message);
      
      const member: User = await client.users.fetch(interaction.customId.split('_')[1]) as User;
      
      let dmMessage = new EmbedBuilder()
        .setTitle('Анкета')
        .setDescription(`**Ты понравился 1 человеку. Хочешь посмотреть кому понравился? Тогда используй команду \`/like\`**`)
        .setColor('#bbffd3')
      
      await member.send({embeds:[dmMessage]})
    }

    let form = await client.userUsecase.getRandomForm(interaction.user.id);
    let err = new EmbedBuilder()
      .setTitle('Анкеты')
      .setDescription('К сожалению активные анкеты кончились. Попробуйте позже.')
      .setColor('#bbffd3')
    
    if(!form){
      await interaction.editReply({embeds:[err], components:[]})
      return
    }
    
    let embed = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription(`
         ${form?.name}, ${form?.age}, ${form?.city}
         ${form?.status}
      `)
      .setColor('#bbffd3')
      .setImage(form?.photo || null);
    
    const buttons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`LikeButton_${form?.userId}`)
          .setEmoji('<:likeIcon:1273558975966744620>')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`MessageLikeButton_${form?.userId}`)
          .setEmoji('<:likeMessageIcon:1273558952235241557>')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`DisLikeButton_${form?.userId}`)
          .setEmoji('<:dislikeIcon:1273559004014055497>')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`ReportButton_${form?.userId}`)
          .setEmoji('<:ticketIcon:1273559224940494858>')
          .setStyle(ButtonStyle.Secondary),
      );
    await interaction.editReply({embeds: [embed], components: [buttons]}).catch(() => {  });
  }
}
