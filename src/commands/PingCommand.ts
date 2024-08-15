import {ICommand} from "../lib/discord/Command";
import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction} from "discord.js";

export default class PingCommand implements ICommand {
  name = 'find';
  description = 'Поиск анкет';

  run({interaction}: { interaction: CommandInteraction }) {
    const buttons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('LikeButton')
          .setLabel('лайк')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('MessageLikeButton')
          .setLabel('лай мессадж')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('DisLikeButton')
          .setLabel('дис лайк')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('ReportButton')
          .setLabel('репорт')
          .setStyle(ButtonStyle.Secondary),
      )
  }
}
