import {IEvent} from "../lib/discord/Event";
import {BaseInteraction} from "discord.js";
import {BotClient} from "../lib/discord/Client";
import { PrometheusClient } from '../lib/prometheus/client'

export default class InteractionCreateEvent implements IEvent {
  name = "interactionCreate";
  run = async (client: BotClient, interaction: BaseInteraction) => {
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
  }
}
