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
const { EmbedBuilder, GuildMemberRoleManager } = require('discord.js');
function registerInteractionHandler(client) {
    client.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        if (interaction.isModalSubmit()) {
            const member = interaction.guild.members.cache.get(interaction.user.id);
            const ch = interaction.guild.channels.cache.find(c => c.id === '1096022053775224872');
            const but = new discord_js_1.ActionRowBuilder()
                .addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId('prinyat')
                .setLabel('Пригласить на собеседование')
                .setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder()
                .setCustomId('poshelnahui')
                .setLabel('Отклонить заявку')
                .setStyle(discord_js_1.ButtonStyle.Danger));
            if (interaction.customId == 'tribunmod') {
                const name = interaction.fields.getTextInputValue('name');
                const chas = interaction.fields.getTextInputValue('chas');
                const opit = interaction.fields.getTextInputValue('opit');
                const fullMember = yield interaction.guild.members.fetch(interaction.user.id);
                const joinedTimestamp = (_b = (_a = fullMember.joinedAt) === null || _a === void 0 ? void 0 : _a.getTime()) !== null && _b !== void 0 ? _b : 0;
                const nabor = new EmbedBuilder()
                    .setTitle('Новая заявка')
                    .setDescription(`
              **ID: 
              \`\`\`${interaction.user.id}\`\`\`
              Tag: 
              \`\`\`${interaction.user.tag}\`\`\`
              Имя и возраст:
              \`\`\`${name}\`\`\`
              Опыт:
              \`\`\`${opit}\`\`\`
              Часовой пояс:
              \`\`\`${chas}\`\`\`
              Link: <@${interaction.user.id}>
              Зарегестрирован:<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>
              Присоединился: <t:${Math.floor(joinedTimestamp / 1000)}:R>**
              `)
                    .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false }))
                    .setTimestamp();
                let msg = yield ch.send({ embeds: [nabor], components: [but], content: '<@&992428549548027945>' });
                interaction.reply({ content: 'Вы успешно отправили заяку', ephemeral: true });
                const collector = msg.createMessageComponentCollector();
                collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                    var _u;
                    const user = (_u = interaction.guild) === null || _u === void 0 ? void 0 : _u.members.cache.get(i.user.id);
                    if (!user)
                        return;
                    switch (i.customId) {
                        case 'prinyat':
                            if (!user.roles.cache.has('992428549548027945')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Принял: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbm = new EmbedBuilder()
                                .setTitle('Вас пригласили на собеседование')
                                .setDescription(`
                    **Вашу заявку на Tribunmod была рассмотрена. Вас приглашают на собеседование.
                    Для уточнения времени собеседования напишите <@${i.user.id}>**
                    `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            member.roles.add('1095050365541564447');
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbm] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                        case 'poshelnahui':
                            if (!user.roles.cache.has('992428549548027945')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Отклонил: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbms = new EmbedBuilder()
                                .setTitle('Вашу заявку отклонили')
                                .setDescription(`
                    **Вашу заявку на Tribunmod была отклонена <@${i.user.id}>.**
                    `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbms] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                    }
                }));
            }
            if (interaction.customId == 'editor') {
                const name = interaction.fields.getTextInputValue('name');
                const chas = interaction.fields.getTextInputValue('chas');
                const opit = interaction.fields.getTextInputValue('opit');
                const prog = interaction.fields.getTextInputValue('prog');
                const fullMember = yield interaction.guild.members.fetch(interaction.user.id);
                const joinedTimestamp = (_d = (_c = fullMember.joinedAt) === null || _c === void 0 ? void 0 : _c.getTime()) !== null && _d !== void 0 ? _d : 0;
                const nabor = new EmbedBuilder()
                    .setTitle('Новая заявка')
                    .setDescription(`
      **ID: 
      \`\`\`${interaction.user.id}\`\`\`
      Tag: 
      \`\`\`${interaction.user.tag}\`\`\`
      Имя и возраст:
      \`\`\`${name}\`\`\`
      Опыт:
      \`\`\`${opit}\`\`\`
      Часовой пояс:
      \`\`\`${chas}\`\`\`
      Использует программы:
      \`\`\`${prog}\`\`\`
      Link: <@${interaction.user.id}>
      Зарегестрирован:<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>
      Присоединился: <t:${Math.floor(joinedTimestamp / 1000)}:R>**
      `)
                    .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false }))
                    .setTimestamp();
                let msg = yield ch.send({ embeds: [nabor], components: [but], content: '<@&1095024330225762416>' });
                interaction.reply({ content: 'Вы успешно отправили заяку', ephemeral: true });
                const collector = msg.createMessageComponentCollector();
                collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                    var _v;
                    const user = (_v = interaction.guild) === null || _v === void 0 ? void 0 : _v.members.cache.get(i.user.id);
                    if (!user)
                        return;
                    switch (i.customId) {
                        case 'prinyat':
                            if (!user.roles.cache.has('1095024330225762416')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Принял: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbm = new EmbedBuilder()
                                .setTitle('Вас пригласили на собеседование')
                                .setDescription(`
            **Вашу заявку на Editor была рассмотрена. Вас приглашают на собеседование.
            Для уточнения времени собеседования напишите <@${i.user.id}>**
            `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            member.roles.add('1095050365541564447');
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbm] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                        case 'poshelnahui':
                            if (!user.roles.cache.has('1095024330225762416')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Отклонил: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbms = new EmbedBuilder()
                                .setTitle('Вашу заявку отклонили')
                                .setDescription(`
            **Вашу заявку на Editor была отклонена <@${i.user.id}>.**
            `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbms] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                    }
                }));
            }
            if (interaction.customId == 'creative') {
                const name = interaction.fields.getTextInputValue('name');
                const times = interaction.fields.getTextInputValue('time');
                const reks = interaction.fields.getTextInputValue('rek');
                const vetkacreatives = interaction.fields.getTextInputValue('vetkacreative');
                const fullMember = yield interaction.guild.members.fetch(interaction.user.id);
                const joinedTimestamp = (_f = (_e = fullMember.joinedAt) === null || _e === void 0 ? void 0 : _e.getTime()) !== null && _f !== void 0 ? _f : 0;
                const nabor = new EmbedBuilder()
                    .setTitle('Новая заявка')
                    .setDescription(`
  **ID: 
  \`\`\`${interaction.user.id}\`\`\`
  Tag: 
  \`\`\`${interaction.user.tag}\`\`\`
  Имя и возраст:
  \`\`\`${name}\`\`\`
  Сколько времени вы готовы уделять серверу:
  \`\`\`${times}\`\`\`
  Интересующая ветка:
  \`\`\`${vetkacreatives}\`\`\`
  Почему именно он:
  \`\`\`${reks}\`\`\`
  Link: <@${interaction.user.id}>
  Зарегестрирован:<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>
  Присоединился: <t:${Math.floor(joinedTimestamp / 1000)}:R>**
  `)
                    .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false }))
                    .setTimestamp();
                let msg = yield ch.send({ embeds: [nabor], components: [but], content: '<@&997106938460504074>' });
                interaction.reply({ content: 'Вы успешно отправили заяку', ephemeral: true });
                const collector = msg.createMessageComponentCollector();
                collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                    var _w;
                    const user = (_w = interaction.guild) === null || _w === void 0 ? void 0 : _w.members.cache.get(i.user.id);
                    if (!user)
                        return;
                    switch (i.customId) {
                        case 'prinyat':
                            if (!user.roles.cache.has('997106938460504074')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Принял: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbm = new EmbedBuilder()
                                .setTitle('Вас пригласили на собеседование')
                                .setDescription(`
        **Вашу заявку на Creative была рассмотрена. Вас приглашают на собеседование.
        Для уточнения времени собеседования напишите <@${i.user.id}>**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            member.roles.add('1095050365541564447');
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbm] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                        case 'poshelnahui':
                            if (!user.roles.cache.has('997106938460504074')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Отклонил: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbms = new EmbedBuilder()
                                .setTitle('Вашу заявку отклонили')
                                .setDescription(`
        **Вашу заявку на Creative была отклонена <@${i.user.id}>.**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbms] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                    }
                }));
            }
            if (interaction.customId == 'eventsmod') {
                const name = interaction.fields.getTextInputValue('name');
                const opit = interaction.fields.getTextInputValue('opit');
                const chas = interaction.fields.getTextInputValue('chas');
                const event = interaction.fields.getTextInputValue('event');
                const fullMember = yield interaction.guild.members.fetch(interaction.user.id);
                const joinedTimestamp = (_h = (_g = fullMember.joinedAt) === null || _g === void 0 ? void 0 : _g.getTime()) !== null && _h !== void 0 ? _h : 0;
                const nabor = new EmbedBuilder()
                    .setTitle('Новая заявка')
                    .setDescription(`
  **ID: 
  \`\`\`${interaction.user.id}\`\`\`
  Tag: 
  \`\`\`${interaction.user.tag}\`\`\`
  Имя и возраст:
  \`\`\`${name}\`\`\`
  Часовой пояс:
  \`\`\`${chas}\`\`\`
  Опыт:
  \`\`\`${opit}\`\`\`
  Какие ивенты знает:
  \`\`\`${event}\`\`\`
  Link: <@${interaction.user.id}>
  Зарегестрирован:<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>
  Присоединился: <t:${Math.floor(joinedTimestamp / 1000)}:R>**
  `)
                    .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false }))
                    .setTimestamp();
                let msg = yield ch.send({ embeds: [nabor], components: [but], content: '<@&992428549548027951>' });
                interaction.reply({ content: 'Вы успешно отправили заяку', ephemeral: true });
                const collector = msg.createMessageComponentCollector();
                collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                    var _x;
                    const user = (_x = interaction.guild) === null || _x === void 0 ? void 0 : _x.members.cache.get(i.user.id);
                    if (!user)
                        return;
                    switch (i.customId) {
                        case 'prinyat':
                            if (!user.roles.cache.has('992428549548027951')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Принял: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbm = new EmbedBuilder()
                                .setTitle('Вас пригласили на собеседование')
                                .setDescription(`
        **Вашу заявку на Eventsmod была рассмотрена. Вас приглашают на собеседование.
        Для уточнения времени собеседования напишите <@${i.user.id}>**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            member.roles.add('1095050365541564447');
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbm] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                        case 'poshelnahui':
                            if (!user.roles.cache.has('992428549548027951')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Отклонил: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbms = new EmbedBuilder()
                                .setTitle('Вашу заявку отклонили')
                                .setDescription(`
        **Вашу заявку на Eventsmod была отклонена <@${i.user.id}>.**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbms] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                    }
                }));
            }
            if (interaction.customId == 'support') {
                const name = interaction.fields.getTextInputValue('name');
                const znaniya = interaction.fields.getTextInputValue('znaniya');
                const chas = interaction.fields.getTextInputValue('chas');
                const timework = interaction.fields.getTextInputValue('timework');
                const fullMember = yield interaction.guild.members.fetch(interaction.user.id);
                const joinedTimestamp = (_k = (_j = fullMember.joinedAt) === null || _j === void 0 ? void 0 : _j.getTime()) !== null && _k !== void 0 ? _k : 0;
                const nabor = new EmbedBuilder()
                    .setTitle('Новая заявка')
                    .setDescription(`
  **ID: 
  \`\`\`${interaction.user.id}\`\`\`
  Tag: 
  \`\`\`${interaction.user.tag}\`\`\`
  Имя и возраст:
  \`\`\`${name}\`\`\`
  Часовой пояс:
  \`\`\`${chas}\`\`\`
  Оценка знаний:
  \`\`\`${znaniya}\`\`\`
  В какое время хочет работать:
  \`\`\`${timework}\`\`\`
  Link: <@${interaction.user.id}>
  Зарегестрирован:<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>
  Присоединился: <t:${Math.floor(joinedTimestamp / 1000)}:R>**
  `)
                    .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false }))
                    .setTimestamp();
                let msg = yield ch.send({ embeds: [nabor], components: [but], content: '<@&1094334039961387030>' });
                interaction.reply({ content: 'Вы успешно отправили заяку', ephemeral: true });
                const collector = msg.createMessageComponentCollector();
                collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                    var _y;
                    const user = (_y = interaction.guild) === null || _y === void 0 ? void 0 : _y.members.cache.get(i.user.id);
                    if (!user)
                        return;
                    switch (i.customId) {
                        case 'prinyat':
                            if (!user.roles.cache.has('1094334039961387030')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Принял: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbm = new EmbedBuilder()
                                .setTitle('Вас пригласили на собеседование')
                                .setDescription(`
        **Вашу заявку на Support была рассмотрена. Вас приглашают на собеседование.
        Для уточнения времени собеседования напишите <@${i.user.id}>**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            member.roles.add('1095050365541564447');
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbm] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                        case 'poshelnahui':
                            if (!user.roles.cache.has('1094334039961387030')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Отклонил: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbms = new EmbedBuilder()
                                .setTitle('Вашу заявку отклонили')
                                .setDescription(`
        **Вашу заявку на Support была отклонена <@${i.user.id}>.**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbms] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                    }
                }));
            }
            if (interaction.customId == 'clanmod') {
                const name = interaction.fields.getTextInputValue('name');
                const opit = interaction.fields.getTextInputValue('opit');
                const chas = interaction.fields.getTextInputValue('chas');
                const fullMember = yield interaction.guild.members.fetch(interaction.user.id);
                const joinedTimestamp = (_m = (_l = fullMember.joinedAt) === null || _l === void 0 ? void 0 : _l.getTime()) !== null && _m !== void 0 ? _m : 0;
                const nabor = new EmbedBuilder()
                    .setTitle('Новая заявка')
                    .setDescription(`
  **ID: 
  \`\`\`${interaction.user.id}\`\`\`
  Tag: 
  \`\`\`${interaction.user.tag}\`\`\`
  Имя и возраст:
  \`\`\`${name}\`\`\`
  Часовой пояс:
  \`\`\`${chas}\`\`\`
  Опыт:
  \`\`\`${opit}\`\`\`
  Link: <@${interaction.user.id}>
  Зарегестрирован:<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>
  Присоединился: <t:${Math.floor(joinedTimestamp / 1000)}:R>**
  `)
                    .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false }))
                    .setTimestamp();
                let msg = yield ch.send({ embeds: [nabor], components: [but], content: '<@&1064260227756720180>' });
                interaction.reply({ content: 'Вы успешно отправили заяку', ephemeral: true });
                const collector = msg.createMessageComponentCollector();
                collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                    var _z;
                    const user = (_z = interaction.guild) === null || _z === void 0 ? void 0 : _z.members.cache.get(i.user.id);
                    if (!user)
                        return;
                    switch (i.customId) {
                        case 'prinyat':
                            if (!user.roles.cache.has('1064260227756720180')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Принял: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbm = new EmbedBuilder()
                                .setTitle('Вас пригласили на собеседование')
                                .setDescription(`
        **Вашу заявку на Clanmod была рассмотрена. Вас приглашают на собеседование.
        Для уточнения времени собеседования напишите <@${i.user.id}>**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            member.roles.add('1095050365541564447');
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbm] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                        case 'poshelnahui':
                            if (!user.roles.cache.has('1064260227756720180')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Отклонил: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbms = new EmbedBuilder()
                                .setTitle('Вашу заявку отклонили')
                                .setDescription(`
        **Вашу заявку на Clanmod была отклонена <@${i.user.id}>.**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbms] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                    }
                }));
            }
            if (interaction.customId == 'moderator') {
                const name = interaction.fields.getTextInputValue('name');
                const opit = interaction.fields.getTextInputValue('opit');
                const chas = interaction.fields.getTextInputValue('chas');
                const znaniya = interaction.fields.getTextInputValue('znaniya');
                const podvet = interaction.fields.getTextInputValue('podvet');
                const fullMember = yield interaction.guild.members.fetch(interaction.user.id);
                const joinedTimestamp = (_p = (_o = fullMember.joinedAt) === null || _o === void 0 ? void 0 : _o.getTime()) !== null && _p !== void 0 ? _p : 0;
                const nabor = new EmbedBuilder()
                    .setTitle('Новая заявка')
                    .setDescription(`
  **ID: 
  \`\`\`${interaction.user.id}\`\`\`
  Tag: 
  \`\`\`${interaction.user.tag}\`\`\`
  Имя и возраст:
  \`\`\`${name}\`\`\`
  Часовой пояс:
  \`\`\`${chas}\`\`\`
  Опыт:
  \`\`\`${opit}\`\`\`
  Оценка знаний:
  \`\`\`${znaniya}\`\`\`
  Желаемая подветка:
  \`\`\`${podvet}\`\`\`
  Link: <@${interaction.user.id}>
  Зарегестрирован:<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>
  Присоединился: <t:${Math.floor(joinedTimestamp / 1000)}:R>**
  `)
                    .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false }))
                    .setTimestamp();
                let msg = yield ch.send({ embeds: [nabor], components: [but], content: '<@&992428549585772648>' });
                interaction.reply({ content: 'Вы успешно отправили заяку', ephemeral: true });
                const collector = msg.createMessageComponentCollector();
                collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                    var _0;
                    const user = (_0 = interaction.guild) === null || _0 === void 0 ? void 0 : _0.members.cache.get(i.user.id);
                    if (!user)
                        return;
                    switch (i.customId) {
                        case 'prinyat':
                            if (!user.roles.cache.has('992428549585772648')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Принял: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbm = new EmbedBuilder()
                                .setTitle('Вас пригласили на собеседование')
                                .setDescription(`
        **Вашу заявку на Moderator была рассмотрена. Вас приглашают на собеседование.
        Для уточнения времени собеседования напишите <@${i.user.id}>**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            member.roles.add('1095050365541564447');
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbm] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                        case 'poshelnahui':
                            if (!user.roles.cache.has('992428549585772648')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Отклонил: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbms = new EmbedBuilder()
                                .setTitle('Вашу заявку отклонили')
                                .setDescription(`
        **Вашу заявку на Moderator была отклонена <@${i.user.id}>.**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbms] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                    }
                }));
            }
            if (interaction.customId == 'mafiamod') {
                const name = interaction.fields.getTextInputValue('name');
                const rules = interaction.fields.getTextInputValue('rules');
                const timeplay = interaction.fields.getTextInputValue('timeplay');
                const znaniya = interaction.fields.getTextInputValue('znaniya');
                const popil = interaction.fields.getTextInputValue('popil');
                const fullMember = yield interaction.guild.members.fetch(interaction.user.id);
                const joinedTimestamp = (_r = (_q = fullMember.joinedAt) === null || _q === void 0 ? void 0 : _q.getTime()) !== null && _r !== void 0 ? _r : 0;
                const nabor = new EmbedBuilder()
                    .setTitle('Новая заявка')
                    .setDescription(`
  **ID: 
  \`\`\`${interaction.user.id}\`\`\`
  Tag: 
  \`\`\`${interaction.user.tag}\`\`\`
  Имя и возраст:
  \`\`\`${name}\`\`\`
  Опыт игры:
  \`\`\`${timeplay}\`\`\`
  Какие правила знает:
  \`\`\`${rules}\`\`\`
  Оценка знаний:
  \`\`\`${znaniya}\`\`\`
  Как проводится попил:
  \`\`\`${popil}\`\`\`
  Link: <@${interaction.user.id}>
  Зарегестрирован:<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>
  Присоединился: <t:${Math.floor(joinedTimestamp / 1000)}:R>**
  `)
                    .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false }))
                    .setTimestamp();
                let msg = yield ch.send({ embeds: [nabor], components: [but], content: '<@&1094333980087685160>' });
                interaction.reply({ content: 'Вы успешно отправили заяку', ephemeral: true });
                const collector = msg.createMessageComponentCollector();
                collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                    var _1;
                    const user = (_1 = interaction.guild) === null || _1 === void 0 ? void 0 : _1.members.cache.get(i.user.id);
                    if (!user)
                        return;
                    switch (i.customId) {
                        case 'prinyat':
                            if (!user.roles.cache.has('1094333980087685160')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Принял: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbm = new EmbedBuilder()
                                .setTitle('Вас пригласили на собеседование')
                                .setDescription(`
        **Вашу заявку на Mafiamod была рассмотрена. Вас приглашают на собеседование.
        Для уточнения времени собеседования напишите <@${i.user.id}>**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            member.roles.add('1095050365541564447');
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbm] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                        case 'poshelnahui':
                            if (!user.roles.cache.has('1094333980087685160')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Отклонил: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbms = new EmbedBuilder()
                                .setTitle('Вашу заявку отклонили')
                                .setDescription(`
        **Вашу заявку на Mafiamod была отклонена <@${i.user.id}>.**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbms] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                    }
                }));
            }
            if (interaction.customId == 'closemod') {
                const name = interaction.fields.getTextInputValue('name');
                const opit = interaction.fields.getTextInputValue('opit');
                const chas = interaction.fields.getTextInputValue('chas');
                const close = interaction.fields.getTextInputValue('close');
                const fullMember = yield interaction.guild.members.fetch(interaction.user.id);
                const joinedTimestamp = (_t = (_s = fullMember.joinedAt) === null || _s === void 0 ? void 0 : _s.getTime()) !== null && _t !== void 0 ? _t : 0;
                const nabor = new EmbedBuilder()
                    .setTitle('Новая заявка')
                    .setDescription(`
  **ID: 
  \`\`\`${interaction.user.id}\`\`\`
  Tag: 
  \`\`\`${interaction.user.tag}\`\`\`
  Имя и возраст:
  \`\`\`${name}\`\`\`
  Опыт:
  \`\`\`${opit}\`\`\`
  Часовой пояс:
  \`\`\`${chas}\`\`\`
  Какие клозы умеет проводить:
  \`\`\`${close}\`\`\`
  Link: <@${interaction.user.id}>
  Зарегестрирован:<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>
  Присоединился: <t:${Math.floor(joinedTimestamp / 1000)}:R>**
  `)
                    .setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false }))
                    .setTimestamp();
                let msg = yield ch.send({ embeds: [nabor], components: [but], content: '<@&992428549548027950>' });
                interaction.reply({ content: 'Вы успешно отправили заяку', ephemeral: true });
                const collector = msg.createMessageComponentCollector();
                collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                    var _2;
                    const user = (_2 = interaction.guild) === null || _2 === void 0 ? void 0 : _2.members.cache.get(i.user.id);
                    if (!user)
                        return;
                    switch (i.customId) {
                        case 'prinyat':
                            if (!user.roles.cache.has('992428549548027950')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Принял: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbm = new EmbedBuilder()
                                .setTitle('Вас пригласили на собеседование')
                                .setDescription(`
        **Вашу заявку на Сlosemod была рассмотрена. Вас приглашают на собеседование.
        Для уточнения времени собеседования напишите <@${i.user.id}>**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            member.roles.add('1095050365541564447');
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbm] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                        case 'poshelnahui':
                            if (!user.roles.cache.has('992428549548027950')) {
                                interaction.reply({ content: 'Это не ваша ветка', ephemeral: true });
                                return;
                            }
                            nabor.setFooter({ text: `Отклонил: ${i.user.tag}` });
                            msg.edit({ embeds: [nabor], components: [] });
                            const mbms = new EmbedBuilder()
                                .setTitle('Вашу заявку отклонили')
                                .setDescription(`
        **Вашу заявку на Сlosemod была отклонена <@${i.user.id}>.**
        `)
                                .setThumbnail(i.user.displayAvatarURL({ forceStatic: false }))
                                .setFooter({ text: `Выполнил: ${i.user.tag}` })
                                .setTimestamp();
                            try {
                                const dmChannel = yield user.createDM();
                                yield member.send({ embeds: [mbms] });
                                i.reply({ content: 'Вы успешно выполнили действие', ephemeral: true });
                            }
                            catch (error) {
                                i.reply({ content: 'К сожалению я не смог отправить пользователю сообщение. Вам нужно связаться с ним напрямую.', ephemeral: true });
                            }
                            break;
                    }
                }));
            }
        }
    }));
}
exports.default = registerInteractionHandler;
