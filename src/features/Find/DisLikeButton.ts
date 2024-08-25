import {IFeature} from "../../lib/discord/Feature";
import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder} from 'discord.js';
import {BotClient} from "../../lib/discord/Client";

export default class DisLikeButton implements IFeature<ButtonInteraction> {
  name = "DisLikeButton";
  preconditions = ['AuthorPrecondition'];

  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    const form = await client.userUsecase.getRandomForm(interaction.user.id);

    let err = new EmbedBuilder()
      .setTitle('Анкеты')
      .setDescription('К сожалению активные анкеты кончились. Попробуйте позже.')
      .setColor('#bbffd3');

    if (!form) {
      await interaction.update({embeds: [err], components: []});
      return;
    }

    const embed = new EmbedBuilder()
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
    await interaction.update({embeds: [embed], components: [buttons]});
    const random = Math.floor(Math.random() * 31) + 1;

    if (random === 1) {
      const advert = await client.advertUsecase.getRandomAdvert();

      const advertEmbed = new EmbedBuilder()
        .setTitle(advert.name)
        .setDescription(advert.text);

      const advertButtons = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setURL(advert.link)
            .setLabel(advert.button)
            .setStyle(ButtonStyle.Link),
        );

      await interaction.followUp({
        embeds: [advertEmbed],
        components: [advertButtons],
        ephemeral: true
      });
    }
  }
}
