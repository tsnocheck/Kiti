import {IFeature} from "../../lib/discord/Feature";
import {ButtonInteraction} from "discord.js";
import getUserId from "../../lib/helpers/getUserId";
import {BotClient} from "../../lib/discord/Client";

export default class DeclineReport implements IFeature<ButtonInteraction> {
  name = "DisableReports";
  run = async ({interaction, client}: { interaction: ButtonInteraction, client: BotClient }) => {
    const id = getUserId(interaction.customId);

    await interaction.update({
      embeds: interaction.message.embeds,
      components: [],
      content: `${interaction.message.content}\n Отключили репорты пользователю <@${id}>`
    });

    await client.moderatorUsecase.disableReports(id);
  };
}
