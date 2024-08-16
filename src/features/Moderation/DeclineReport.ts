import {IFeature} from "../../lib/discord/Feature";
import {ButtonInteraction} from "discord.js";

export default class DeclineReport implements IFeature<ButtonInteraction> {

  name = "DeclineReport";
  run = async ({interaction}: { interaction: ButtonInteraction }) => {
    await interaction.update({
      embeds: interaction.message.embeds,
      components: [],
      content: interaction.message.content + '\nОтклонено'
    });
  };
}
