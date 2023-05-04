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
const discord_js_1 = require("discord.js");
const EmbedGenerate_1 = require("../../function/EmbedGenerate");
global.interactions = new Map();
function registerInteractionHandler(client) {
    client.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isCommand() && !interaction.isButton() && !interaction.isStringSelectMenu()) {
            return;
        }
        try {
            if (interaction.isStringSelectMenu()) {
                const row = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Отправить заявку')
                    .setStyle(discord_js_1.ButtonStyle.Success));
                global.interactions.set(interaction.user.id, interaction.values[0]);
                switch (interaction.values[0]) {
                    case 'tribunmod':
                        interaction.reply({ embeds: [(0, EmbedGenerate_1.Embed)('tribunmodemb')], components: [row], ephemeral: true, fetchReply: true });
                        break;
                    case 'editor':
                        interaction.reply({ embeds: [(0, EmbedGenerate_1.Embed)('editoremb')], components: [row], ephemeral: true, fetchReply: true });
                        break;
                    case 'creative':
                        interaction.reply({ embeds: [(0, EmbedGenerate_1.Embed)('creativeemb')], components: [row], ephemeral: true, fetchReply: true });
                        break;
                    case 'eventsmod':
                        interaction.reply({ embeds: [(0, EmbedGenerate_1.Embed)('eventsmodemb')], components: [row], ephemeral: true, fetchReply: true });
                        break;
                    case 'support':
                        interaction.reply({ embeds: [(0, EmbedGenerate_1.Embed)('supportemb')], components: [row], ephemeral: true, fetchReply: true });
                        break;
                    case 'clanmod':
                        interaction.reply({ embeds: [(0, EmbedGenerate_1.Embed)('clanemb')], components: [row], ephemeral: true, fetchReply: true });
                        break;
                    case 'moderator':
                        interaction.reply({ embeds: [(0, EmbedGenerate_1.Embed)('moderemb')], components: [row], ephemeral: true, fetchReply: true });
                        break;
                    case 'mafiamod':
                        interaction.reply({ embeds: [(0, EmbedGenerate_1.Embed)('mafiaemb')], components: [row], ephemeral: true, fetchReply: true });
                        break;
                    case 'closemod':
                        interaction.reply({ embeds: [(0, EmbedGenerate_1.Embed)('closeemb')], components: [row], ephemeral: true, fetchReply: true });
                        break;
                }
                yield interaction.message.components.forEach((component) => {
                    if (component.type === 'SELECT_MENU') {
                        component.options.forEach((option) => {
                            option.default = false;
                        });
                    }
                });
                yield interaction.message.edit({ components: interaction.message.components });
            }
        }
        catch (error) {
            console.error(`Error processing interaction: ${error}`);
            yield interaction.reply({
                content: 'An error occurred while processing your interaction',
                ephemeral: true
            });
        }
    }));
}
exports.default = registerInteractionHandler;
