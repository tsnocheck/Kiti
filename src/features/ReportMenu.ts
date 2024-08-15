import {IFeature} from "../lib/discord/Feature";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuInteraction} from "discord.js";
import {BotClient} from "../lib/discord/Client";
import {getClass} from "@typegoose/typegoose";

export default class ReportMenu implements IFeature<StringSelectMenuInteraction> {
  name = 'ReportMenu';
  async run({ interaction, client } : { interaction: StringSelectMenuInteraction, client: BotClient }) {
    const channelId = '882197686193881148';

    const id = interaction.customId.split('_')[1]

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('BanUser')
        .setLabel('Забанить')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('DeclineReport')
        .setLabel('Отклонить')
        .setStyle(ButtonStyle.Primary)
    )

    const channel = await client.channels.fetch(channelId)

    const form = await client.usercases?.findByUserId(id)

    let embed = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription(`
        ${form?.name}, ${form?.age}, ${form?.city}
        ${form?.status}
      `)
      .setColor(0x2b2d31)
      .setImage(form?.photo || null)

    if(channel?.isTextBased()) {
      await channel.send({
        content: `Новый репорт: ${id}\n Причина: ${interaction.component.options.find(i => i.value === interaction.values[0])?.label}`,
        components: [row],
        embeds: [embed]
      })
    }

    await interaction.reply({
      ephemeral: true,
      content: 'Жалоба успешно отправлена!'
    })
  }
}
