import { InteractionType } from 'discord-api-types/v10'
import {IEvent} from "../lib/discord/Event";
import {BaseInteraction} from "discord.js";
import {BotClient} from "../lib/discord/Client";
import { logger } from '../lib/services/logger'

export default class InteractionCreateEvent implements IEvent {
  name = "interactionCreate";
  run = async (client: BotClient, interaction: BaseInteraction) => {
    try{
      await client.metrics.incrementInteraction(interaction)
      if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        
        if (command) {
          command.run({interaction, client});
        }
      } else if (interaction.isMessageComponent()) {
        const feature = client.features.get(interaction.customId);
        if (feature) {
          feature.run({interaction, client});
        }
      }
    }catch(error){
      await client.metrics.incrementErrorInteraction(interaction)
      if(interaction.type === InteractionType.MessageComponent){
        if(interaction.isButton()){
          logger.error(`Type Button - ${error}`)
        }
        if(interaction.isStringSelectMenu()){
          logger.error(`Type StringSelectMenu - ${error}`)
        }
      }else{
        logger.error(`Type ${interaction.type} - ${error}`)
      }
    }
  }
}
