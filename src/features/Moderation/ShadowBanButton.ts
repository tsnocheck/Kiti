import {IFeature} from "../../lib/discord/Feature";
import {ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle} from "discord.js";
import {BotClient} from "../../lib/discord/Client";

export default class ShadowBanButton implements IFeature<ButtonInteraction> {
  name = 'ShadowBanButton';

  run = async ({interaction, client}: { interaction: ButtonInteraction, client: BotClient }) => {
    const id = interaction.message.embeds[0].footer!.text;

    const modal = new ModalBuilder()
      .setCustomId('BanUserModal_' + id + '_' + 'shadow')
      .setTitle('Бан пользователя')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>()
          .addComponents(
            new TextInputBuilder()
              .setCustomId('reason')
              .setLabel('Причина')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          )
      );

    await interaction.showModal(modal);
  };
}
