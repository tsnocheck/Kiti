import {ICommand} from "../lib/discord/Command";
import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction} from "discord.js";
import {IFeature} from "../lib/discord/Feature";

export default class PingCommand implements ICommand {
  name = 'ping';
  description = 'Pong!';

  run({interaction}: { interaction: CommandInteraction }) {
    const button = new ButtonBuilder().setCustomId("PingButton").setLabel("Ping").setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)
    interaction.reply({components: [row], content: "Pong!"});
  }
}

class ButtonFeature implements IFeature<ButtonInteraction> {
  name = "PingButton"

  run({interaction}: { interaction: ButtonInteraction }): any {
    interaction.reply("Double Pong!");
  }

}
