import {ICommand} from "../lib/discord/Command";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder} from 'discord.js';
import {BotClient} from "../lib/discord/Client";

export default class FindCommand implements ICommand {
  name = 'find';
  description = 'Поиск анкет';
  preconditions = ['CheckForm', 'AppealForm'];

  async run({interaction, client}: { interaction: CommandInteraction, client: BotClient }) {
    let form = await client.userUsecase.getRandomForm(interaction.user.id);
    const user = await client.userUsecase.findByUserId(interaction.user.id);
    
    if (interaction.deferred || interaction.replied) return;
    if(form == undefined){
      await interaction.reply({content:'К сожалению нет активных анкет', ephemeral:true})
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

      let infoEmb = new EmbedBuilder()
        .setDescription(`
          <:likeIcon:1273558975966744620> - Лайкнуть пользователя
          <:likeMessageIcon:1273558952235241557> - Лайкнуть с сообщением
          <:dislikeIcon:1273559004014055497> - Пропустить анкету
          <:ticketIcon:1273559224940494858> - Отправить репорт
        `)
        .setColor('#bbffd3')

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
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(user?.disabledReports),
      );
    await interaction.reply({embeds: [embed, infoEmb], components: [buttons]});
  }
}
