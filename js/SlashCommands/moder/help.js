const { version } = require('discord.js');
const { platform, arch, release, cpus, totalmem, freemem} = require('os');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const { log } = require('console');
const ms = require('ms');
module.exports = {
  name: 'help',
  description: 'Команды бота',
  type: 'CHAT_INPUT',
  run: async (client, interaction, args, message) => {
    const embed = new MessageEmbed()
      .setTitle('Команды бота')
      .setDescription(`
         **\`/find\` - поиск анкеты
         \`/profile\` - просмотр своей анкета
         \`/like\` - просмотр анкет, которые тебя лайкнули
         \`/info\` - информация о тех. части бота
         \`/idea\` - отправить идею для бота
         \`/bugs\` - отправить информацию о баге в боте
         **
      `)
      .setTimestamp();
    interaction.reply({ embeds: [embed] });
  },
};