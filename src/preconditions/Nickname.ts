import {IPrecondition} from "../lib/discord/Precondition";
import {
  BaseInteraction, GuildMember, RepliableInteraction,
} from "discord.js";

export default class NicknamePrecondition implements IPrecondition {
  name ='NicknamePrecondition'

  async run({ interaction }: { interaction: BaseInteraction }) {
    if(interaction.inGuild()) {
      if((interaction.member as GuildMember).displayName !== 'Akavi') {
        await (interaction as RepliableInteraction).reply({content: 'Only Akavi can use this command', ephemeral: true});
        return false;
      }
    }
    return true;
  }
}
