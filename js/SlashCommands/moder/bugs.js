const { version } = require('discord.js');
const { platform, arch, release, cpus, totalmem, freemem} = require('os');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const { log } = require('console');
const ms = require('ms');
module.exports = {
  name: 'bug',
  description: 'отправить информацию о баге',
  type: 'CHAT_INPUT',
  type: 'DM',
  options: [
      
    {
        name: "bugs",
        description: "опишите сам баг",
        type: 3,
        required:true,
    },

],
  run: async (client, interaction, args, message) => {
    let m = interaction.options.getString("bugs");
    const guildId = '992428549342498836';

    const guild = client.guilds.cache.get(guildId);
    const ch = guild.channels.cache.find(c => c.id === '1096990471605211187')
    const msg = new MessageEmbed()
    .setTitle('Найден баг')
    .setDescription(`
    Автор найденного бага: <@${interaction.user.id}>
    Идея:
    \`\`\`${m}\`\`\`
    `)
    .setTimestamp();
    await ch.send({embeds:[msg]})
    await interaction.reply({content:'Вы успешно отправили информацию о баге!', ephemeral:true});
  },
  dmOnly: true
};