const { version } = require('discord.js');
const { platform, arch, release, cpus, totalmem, freemem} = require('os');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const { log } = require('console');
const ms = require('ms');
module.exports = {
  name: 'idea',
  description: 'идея для новвоведения бота',
  type: 'CHAT_INPUT',
  options: [
      
    {
        name: "idea",
        description: "ваша идея",
        type: 3,
        required:true,
    },

],
  run: async (client, interaction, args, message) => {
    let m = interaction.options.getString("idea");
    const guildId = '992428549342498836';

    const guild = client.guilds.cache.get(guildId);

    const ch = guild.channels.cache.find(c => c.id === '1096991629350551623')
    const msg = new MessageEmbed()
    .setTitle('Новая идея')
    .setDescription(`
    Автор идеи: <@${interaction.user.id}>
    Идея:
    \`\`\`${m}\`\`\`
    `)
    .setTimestamp();
    await ch.send({embeds:[msg]})
    await interaction.reply({content:'Вы успешно отправили свою идею!', ephemeral:true});
  },
};