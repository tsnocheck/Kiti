import { EmbedBuilder } from "@discordjs/builders";
import { embeds } from "../embeds/embed"; // добавляем эту строку, чтобы импортировать объект embeds

export function Embed(name: keyof typeof embeds, props?: Record<string, string | number>){
const embed = Object.assign({}, embeds[name]);
if(embed.description && props){
for(const key of Object.keys(props)){
embed.description = embed.description.replaceAll(`{${key}}`, props[key].toString()); // исправляем здесь, чтобы использовать обратные кавычки вместо фигурных скобок, и привести props[key] к строковому типу
}
}
return new EmbedBuilder(embed);
}