import {ICommand} from "../lib/discord/Command";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  RepliableInteraction
} from 'discord.js'
import {BotClient} from "../lib/discord/Client";

export default class FindCommand implements ICommand {
  name = 'find';
  description = 'Поиск анкет';
  preconditions = ['CheckForm', 'AppealForm'];

  async run({interaction, client}: { interaction: CommandInteraction, client: BotClient }) {
    let form = await client.userUsecase.getRandomForm(interaction.user.id);
    
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
    await interaction.reply({embeds: [embed], components: [buttons]});
  }
}
