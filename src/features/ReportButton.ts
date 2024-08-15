import {IFeature} from "../lib/discord/Feature";
import {ActionRowBuilder, ButtonInteraction, StringSelectMenuBuilder} from "discord.js";

export default class ButtonFeature implements IFeature<ButtonInteraction> {
  name = "ReportButton";

  async run({interaction}: { interaction: ButtonInteraction }): Promise<any> {
    const userId = interaction.customId.split('_')[1];
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`ReportMenu_${userId}`)
        .setPlaceholder('Выберите причину жалобы')
        .setOptions([
          {
            label: 'Материал для взрослых',
            emoji: '🔞',
            value: 'nsfw_content'
          },
          {
            label: 'Продажа товаров и услуг.',
            emoji: '💰',
            value: 'commerce',
          },
          {
            label: 'Оскорбление или вызывающие высказывания',
            emoji: '📄',
            value: 'language',
          },
          {
            label: 'Другое',
            emoji: '📜',
            value: 'other',
          },
        ])
    );

    await interaction.reply({
      content: 'Выберите причину жалобы на анкету',
      components: [row]
    });
  }
}
