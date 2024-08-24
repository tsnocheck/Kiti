import {IFeature} from "../../lib/discord/Feature";
import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {BotClient} from "../../lib/discord/Client";

export default class BanButton implements IFeature<ButtonInteraction> {
  name = 'BanButton';

  run = async ({interaction, client}: { interaction: ButtonInteraction, client: BotClient }) => {
    const id = interaction.message.embeds[0].footer!.text;

    const row = new ActionRowBuilder<TextInputBuilder>()
      .addComponents(
        new TextInputBuilder()
          .setCustomId('reason')
          .setLabel('Причина')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Нецензурная лексика')
          .setRequired(true)
      );

    const modal = new ModalBuilder()
      .setCustomId(`BanModal_${id}_permanent`)
      .setTitle('Бан пользователя')
      .addComponents(
        row
      );

    await interaction.showModal(modal);
  };
}
