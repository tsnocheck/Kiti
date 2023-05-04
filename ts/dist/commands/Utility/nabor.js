"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../class/Command");
const discord_js_1 = require("discord.js");
const EmbedGenerate_1 = require("../../function/EmbedGenerate");
exports.default = new Command_1.Command({
    command_data: new discord_js_1.SlashCommandBuilder()
        .setName('nabor')
        .setDescription('Создать эмбед о наборе')
        .toJSON(),
    run: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (interaction.user.id != '232476435451740160')
                return interaction.reply({ content: 'Вы не имеете право использовать данную команду', ephemeral: true });
            const row = new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.StringSelectMenuBuilder()
                .setCustomId('naborselect')
                .setPlaceholder('Выберете')
                .addOptions([
                {
                    label: 'Tribunmod',
                    value: 'tribunmod',
                    emoji: '<:Tribunemod:1097548012571611236>'
                },
                {
                    label: 'Editor',
                    value: 'editor',
                    emoji: '<:Editor:1097547855763353640>'
                },
                {
                    label: 'Creative',
                    value: 'creative',
                    emoji: '<:Creative:1097547844338077746>'
                },
                {
                    label: 'Eventsmod',
                    value: 'eventsmod',
                    emoji: '<:Eventsmod:1097547858334453790>'
                },
                {
                    label: 'Support',
                    value: 'support',
                    emoji: '<:Support:1097547874545434824> '
                },
                {
                    label: 'Clanmod',
                    value: 'clanmod',
                    emoji: '<:Clanmod:1097547830492672121>'
                },
                {
                    label: 'Moderator',
                    value: 'moderator',
                    emoji: '<:Moderator:1097547873152938104>'
                },
                {
                    label: 'Mafiamod',
                    value: 'mafiamod',
                    emoji: '<:Mafiamod:1097547867029262379> '
                },
                {
                    label: 'Closemod',
                    value: 'closemod',
                    emoji: '<:Closemod:1097547831893557360>'
                },
            ]));
            yield interaction.channel.send({
                embeds: [(0, EmbedGenerate_1.Embed)('nabor').setFooter({ text: 'discord.gg/unique', iconURL: 'https://cdn.discordapp.com/icons/992428549342498836/a_431a3be54fc30406c87de2ee9ef23d97.gif?size=512' })],
                components: [row]
            });
            yield interaction.reply({ content: 'Вы успешно отправили сообщение', ephemeral: true });
        }
        catch (_a) {
            interaction.reply({ content: 'Произошла ошибка при выполнении команды, ошибка была отправлена в консоль', ephemeral: true });
            console.error();
        }
    })
});
