import {IFeature} from "../../lib/discord/Feature";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuInteraction} from "discord.js";
import {BotClient} from "../../lib/discord/Client";
import {logger} from "../../lib/services/logger";

export default class ReportMenu implements IFeature<StringSelectMenuInteraction> {
  name = 'ReportMenu';

  async run({interaction, client}: { interaction: StringSelectMenuInteraction, client: BotClient }) {
    const channelId = '1273697633684291637';

    const id = interaction.customId.split('_')[1];

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('BanButton')
        .setLabel('Перманентный бан')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('ShadowBanButton')
        .setLabel('Теневой бан')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('DeclineReport')
        .setLabel('Отклонить')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`DisableReports_${interaction.user.id}`)
        .setLabel('Отключить репорты пользователю')
        .setStyle(ButtonStyle.Danger)
    );

    const channel = await client.channels.fetch(channelId);

    const form = await client.userUsecase?.findByUserId(id);

    let embed = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription(`
        ${form?.name}, ${form?.age}, ${form?.city}
        ${form?.status}
      `)
      .setColor('#bbffd3')
      .setFooter({
        text: id
      })
      .setImage(form?.photo || null);

    if (channel?.isTextBased()) {
      await channel.send({
        content: `Новый репорт: ${id}\n Причина: ${interaction.component.options.find(i => i.value === interaction.values[0])?.label}`,
        components: [row],
        embeds: [embed]
      });
    }

    await interaction.reply({
      ephemeral: true,
      content: 'Жалоба успешно отправлена!'
    });

    logger.info(`${interaction.user.id} | ${interaction.user.username} reported ${id} | ${interaction.values[0]}`);
  }
}
