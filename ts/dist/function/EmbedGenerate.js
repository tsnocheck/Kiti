"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Embed = void 0;
const builders_1 = require("@discordjs/builders");
const embed_1 = require("../embeds/embed"); // добавляем эту строку, чтобы импортировать объект embeds
function Embed(name, props) {
    const embed = Object.assign({}, embed_1.embeds[name]);
    if (embed.description && props) {
        for (const key of Object.keys(props)) {
            embed.description = embed.description.replaceAll(`{${key}}`, props[key].toString()); // исправляем здесь, чтобы использовать обратные кавычки вместо фигурных скобок, и привести props[key] к строковому типу
        }
    }
    return new builders_1.EmbedBuilder(embed);
}
exports.Embed = Embed;
