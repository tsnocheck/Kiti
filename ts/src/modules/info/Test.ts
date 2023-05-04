import { Client, Interaction, ButtonBuilder, ButtonStyle, ActionRowBuilder} from 'discord.js';
import { Embed } from '../../function/EmbedGenerate';
const { Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

export default function registerInteractionHandler(client: Client) {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand() && !interaction.isButton() && !interaction.isStringSelectMenu()) {
      return;
    }
    try {
    } catch (error) {

    }
  });
}