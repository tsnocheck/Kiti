import {IFeature} from "../lib/discord/Feature";
import {ButtonInteraction} from "discord.js";

export default class ButtonFeature implements IFeature<ButtonInteraction> {
  name = "PingButton"

  run({interaction}: { interaction: ButtonInteraction }): any {
    interaction.reply("Double Pong!");
  }
}
