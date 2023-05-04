import { Command } from "../../class/Command";
import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } from "discord.js";
import { Embed } from "../../function/EmbedGenerate";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('nabor')
        .setDescription('Создать эмбед о наборе')
        .toJSON(),
    run: async (client, interaction) => {
        try{

        }catch{

        }
    }
});
