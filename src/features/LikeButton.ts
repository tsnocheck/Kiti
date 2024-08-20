import {IFeature} from "../lib/discord/Feature";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, type User } from 'discord.js'
import {BotClient} from "../lib/discord/Client";

export default class LikeButton implements IFeature<ButtonInteraction> {
  name = "LikeButton";
  preconditions = ['AuthorPrecondition'];

  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    let usercases = client.userUsecase;
    if (interaction.deferred || interaction.replied) return;
    await usercases.like(interaction.customId.split('_')[1], interaction.user.id).catch(() => {});
    
    const member: User = await client.users.fetch(interaction.customId.split('_')[1]) as User;
    
    let dmMessage = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription(`**Ты понравился 1 человеку. Хочешь посмотреть кому понравился? Тогда используй команду \`/like\`**`)
      .setColor(0x2b2d31)
    
    await member.send({embeds:[dmMessage]})
    
    let form = await usercases.getRandomForm(interaction.user.id);
    let err = new EmbedBuilder()
      .setTitle('Анкеты')
      .setDescription('К сожалению активные анкеты кончились. Попробуйте позже.')
      .setColor(0x2b2d31)
    
    if(!form){
      await interaction.update({embeds:[err], components:[]})
      return
    }
    
    let embed = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription(`
         ${form?.name}, ${form?.age}, ${form?.city}
         ${form?.status}
      `)
      .setColor(0x2b2d31)
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
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`DisLikeButton_${form?.userId}`)
          .setEmoji('<:dislikeIcon:1273559004014055497>')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`ReportButton_${form?.userId}`)
          .setEmoji('<:ticketIcon:1273559224940494858>')
          .setStyle(ButtonStyle.Secondary),
      );
    await interaction.update({embeds: [embed], components: [buttons]}).catch(() => {  });
    await interaction.followUp({content: 'Вы успешно лайкнули анкету', ephemeral: true}).catch(() => {  });
  }
}
