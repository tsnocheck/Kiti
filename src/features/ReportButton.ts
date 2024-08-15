import { IFeature } from "../lib/discord/Feature";
import { ButtonInteraction } from "discord.js";

export default class ButtonFeature implements IFeature<ButtonInteraction> {
  name = "ReportButton";
  
  async run({ interaction }: { interaction: ButtonInteraction }): Promise<any> {
    await interaction.reply("Double Pong!");
  }
}
