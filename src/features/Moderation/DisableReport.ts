import {IFeature} from "../../lib/discord/Feature";
import {ButtonInteraction} from "discord.js";
import getUserId from "../../lib/helpers/getUserId";

export default class DeclineReport implements IFeature<ButtonInteraction> {
  name = "DisableReports";
  run = async ({interaction}: { interaction: ButtonInteraction }) => {
    const id = getUserId(interaction.customId);

    await interaction.update({
      embeds: interaction.message.embeds,
      components: [],
      content: `${interaction.message.content}\n Отключили репорты пользователю <@${id}>`
    });
  };
}
