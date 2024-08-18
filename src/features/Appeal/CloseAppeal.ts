import type { BotClient } from '../../lib/discord/Client'
import {IFeature} from "../../lib/discord/Feature";
import {
  ButtonInteraction, EmbedBuilder, type User
} from 'discord.js'

export default class AcceptAppeal implements IFeature<ButtonInteraction> {
  name = "CloseAppeal";

  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    await interaction.update({content:'Аппеляция отклонена', components:[]})
  }
}
