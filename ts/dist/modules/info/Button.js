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
const { Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
function registerInteractionHandler(client) {
    client.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isCommand() && !interaction.isButton() && !interaction.isStringSelectMenu()) {
            return;
        }
        try {
            if (interaction.isButton()) {
                if (interaction.customId == 'confirm') {
                    let use = global.interactions.get(interaction.user.id);
                    const name = new TextInputBuilder()
                        .setCustomId('name')
                        .setLabel("Ваше имя и возраст")
                        .setPlaceholder('Например: Андрей, 18')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);
                    const opit = new TextInputBuilder()
                        .setCustomId('opit')
                        .setLabel("Есть у вас опыт? Если да то какой?")
                        .setPlaceholder('Например: я раньше стоял на таких-то серверах столько-то')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true);
                    const time = new TextInputBuilder()
                        .setCustomId('time')
                        .setLabel("Сколько времени вы готовы уделять серверу?")
                        .setPlaceholder('Например: я готов уделять серверу по 4 часа в день')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);
                    const vetkacreative = new TextInputBuilder()
                        .setCustomId('vetkacreative')
                        .setLabel("На какую подветку вы хотите встать?")
                        .setPlaceholder('Например: я хочу встать на ветку кино')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);
                    const rek = new TextInputBuilder()
                        .setCustomId('rek')
                        .setLabel("Почему именно вы?")
                        .setPlaceholder('Например: потому что я коммуникабельный и стрессоустойчивый')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true);
                    const event = new TextInputBuilder()
                        .setCustomId('event')
                        .setLabel("Какие ивенты вы умеете проводить?")
                        .setPlaceholder('Например: гартик, бункер и т.д.')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true);
                    const znaniya = new TextInputBuilder()
                        .setCustomId('znaniya')
                        .setLabel("Оцените ваши знания от 1-10")
                        .setPlaceholder('Например: мои знания 10 из 10')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);
                    const timework = new TextInputBuilder()
                        .setCustomId('timework')
                        .setLabel("В какое время вы хотите работать?")
                        .setPlaceholder('Например: я хочу работать с 10:00 до 14:00 по мск')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);
                    const timeplay = new TextInputBuilder()
                        .setCustomId('timeplay')
                        .setLabel("Сколько примерно времени играете?")
                        .setPlaceholder('Например: я играю примерно пол года в город')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);
                    const rules = new TextInputBuilder()
                        .setCustomId('rules')
                        .setLabel("Какие правила знаете? (ФИИМ, Палемика)")
                        .setPlaceholder('Например: я знаю ФИИМ и Палемику')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);
                    const popil = new TextInputBuilder()
                        .setCustomId('popil')
                        .setLabel("Как проводится автокатастрофа(попил)?")
                        .setPlaceholder('Например: попил происходит так и расписываете')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true);
                    const close = new TextInputBuilder()
                        .setCustomId('close')
                        .setLabel("Какие клозы вы умеете проводить?")
                        .setPlaceholder('Например: я умею проводить клозы дота2, ксго, валорант и т.д.')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true);
                    const podvet = new TextInputBuilder()
                        .setCustomId('podvet')
                        .setLabel("На какой подветке хотите работать?")
                        .setPlaceholder('Например: я хочу работать контролом')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);
                    const chas = new TextInputBuilder()
                        .setCustomId('chas')
                        .setLabel("Ваш часовой пояс относительно МСК")
                        .setPlaceholder('Например: +2 к МСК или МСК')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true);
                    const prog = new TextInputBuilder()
                        .setCustomId('prog')
                        .setLabel("В каких программах монтируете?")
                        .setPlaceholder('Например: я монтирую в After Effect')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true);
                    const names = new discord_js_1.ActionRowBuilder().addComponents(name);
                    const opits = new discord_js_1.ActionRowBuilder().addComponents(opit);
                    const times = new discord_js_1.ActionRowBuilder().addComponents(time);
                    const vetkacreatives = new discord_js_1.ActionRowBuilder().addComponents(vetkacreative);
                    const reks = new discord_js_1.ActionRowBuilder().addComponents(rek);
                    const events = new discord_js_1.ActionRowBuilder().addComponents(event);
                    const znaniyas = new discord_js_1.ActionRowBuilder().addComponents(znaniya);
                    const timeworks = new discord_js_1.ActionRowBuilder().addComponents(timework);
                    const timeplays = new discord_js_1.ActionRowBuilder().addComponents(timeplay);
                    const ruless = new discord_js_1.ActionRowBuilder().addComponents(rules);
                    const popils = new discord_js_1.ActionRowBuilder().addComponents(popil);
                    const closes = new discord_js_1.ActionRowBuilder().addComponents(close);
                    const podvets = new discord_js_1.ActionRowBuilder().addComponents(podvet);
                    const chass = new discord_js_1.ActionRowBuilder().addComponents(chas);
                    const progs = new discord_js_1.ActionRowBuilder().addComponents(prog);
                    switch (use) {
                        case 'tribunmod':
                            const tribunmod = new ModalBuilder()
                                .setCustomId('tribunmod')
                                .setTitle('Заполните анкету');
                            tribunmod.addComponents(names, opits, chass);
                            yield interaction.showModal(tribunmod);
                            break;
                        case 'editor':
                            const editor = new ModalBuilder()
                                .setCustomId('editor')
                                .setTitle('Заполните анкету');
                            editor.addComponents(names, opits, progs, chass);
                            yield interaction.showModal(editor);
                            break;
                        case 'creative':
                            const creative = new ModalBuilder()
                                .setCustomId('creative')
                                .setTitle('Заполните анкету');
                            creative.addComponents(names, times, vetkacreatives, reks);
                            yield interaction.showModal(creative);
                            break;
                        case 'eventsmod':
                            const eventsmod = new ModalBuilder()
                                .setCustomId('eventsmod')
                                .setTitle('Заполните анкету');
                            eventsmod.addComponents(names, opits, chass, events);
                            yield interaction.showModal(eventsmod);
                            break;
                        case 'support':
                            const support = new ModalBuilder()
                                .setCustomId('support')
                                .setTitle('Заполните анкету');
                            support.addComponents(names, chass, znaniyas, timeworks);
                            yield interaction.showModal(support);
                            break;
                        case 'clanmod':
                            const clanmod = new ModalBuilder()
                                .setCustomId('clanmod')
                                .setTitle('Заполните анкету');
                            clanmod.addComponents(names, opits, chass);
                            yield interaction.showModal(clanmod);
                            break;
                        case 'moderator':
                            const moderator = new ModalBuilder()
                                .setCustomId('moderator')
                                .setTitle('Заполните анкету');
                            moderator.addComponents(names, opits, chass, znaniyas, podvets);
                            yield interaction.showModal(moderator);
                            break;
                        case 'mafiamod':
                            const mafiamod = new ModalBuilder()
                                .setCustomId('mafiamod')
                                .setTitle('Заполните анкету');
                            mafiamod.addComponents(names, znaniyas, timeplays, ruless, popils);
                            yield interaction.showModal(mafiamod);
                            break;
                        case 'closemod':
                            const closemod = new ModalBuilder()
                                .setCustomId('closemod')
                                .setTitle('Заполните анкету');
                            closemod.addComponents(names, opits, chass, closes);
                            yield interaction.showModal(closemod);
                            break;
                    }
                }
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
