const { version } = require('discord.js');
const { platform, arch, release, cpus, totalmem, freemem} = require('os');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const { log } = require('console');
const ms = require('ms');
module.exports = {
  name: 'info',
  description: 'Выводит информацию о боте и хостинге',
  type: 'CHAT_INPUT',
  run: async (client, interaction, args, message) => {
    const embed = new MessageEmbed()
      .setTitle('Информация о боте и хостинге')
      .setDescription(`
         **Имя хоста: Kite
         Версия бота: beta 1.0
         Архитектура процессора: ${arch()} 
         Версия ОС: ${release()}
         Количество ядер: ${cpus().length}
         Версия Discord.js: ${version}
         Версия Node.js, ${process.version}
         Задержка API: ${Math.round(interaction.client.ws.ping)} мс
         Использовано оперативной памяти: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} МБ
         Всего оперативной памяти: ${(totalmem() / 1024 / 1024).toFixed(2)} МБ
         Свободной оперативной памяти ${(freemem() / 1024 / 1024).toFixed(2)} МБ
         Uptime: ${ms(interaction.client.uptime, { long: true })}
         Owner Bot: <@232476435451740160>
         Owner ID Bot: 232476435451740160 
         Owner Tag Bot: Mr.Kitekat#0420
         Owner Server: <@${interaction.guild.ownerId}>**
      `)
      .setTimestamp();
    interaction.reply({ embeds: [embed] });
  },
};