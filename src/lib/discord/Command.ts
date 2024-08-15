import {ApplicationCommandOptionData, CommandInteraction} from "discord.js";
import {BotClient} from "./Client";
import {IFeature} from "./Feature";

interface ICommand {
  name: string;
  description: string;
  options?: ApplicationCommandOptionData[];
  features?: IFeature<any>[];
  preconditions?: string[];
  run: RunCommand;
}

type RunCommand = ({interaction, client}: { interaction: CommandInteraction, client: BotClient }) => any;

export {ICommand};
