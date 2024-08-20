import {CommandInteraction, EmbedBuilder} from "discord.js";
import {ICommand} from "../lib/discord/Command";

export default class InfoCommand implements ICommand {
  name = 'info';
  description = 'Посмотреть информацию о боте';

  run = async ({interaction}: { interaction: CommandInteraction }) => {
    const embed = new EmbedBuilder()
      .setTitle('Информация')
      .setColor('#bbffd3')
      .setDescription(`
        Heka - это не просто бот. Это ваш помощник в поиске новых, интересных людей.\n
        Здесь вы можете найти себе от друга до второй половинки.
        Анкеты - лучший способ найти человека из пользователей Discord.
        Создайте свою и начните поиск новых знакомств!
        
        Разработчики: <@751866920608727060>, <@232476435451740160>
      `)
      .setThumbnail(interaction.client.user.avatarURL({size: 512, extension: 'png'}))
      .setFooter({
        text: 'Версия бота v1.0.0'
      });

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  };
}
