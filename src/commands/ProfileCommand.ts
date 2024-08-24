import {ICommand} from "../lib/discord/Command";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder} from 'discord.js';
import {BotClient} from "../lib/discord/Client";

export default class FindCommand implements ICommand {
  name = 'profile';
  description = 'Профиль пользователя';
  preconditions = ['CheckForm', 'AppealForm'];

  async run({interaction, client}: { interaction: CommandInteraction, client: BotClient }) {
    const user = await client.userUsecase.findByUserId(interaction.user.id);
    
    if (interaction.deferred || interaction.replied) return;
    
    let embed = new EmbedBuilder()
      .setTitle('Ваша анкета')
      .setDescription(`
        ${user?.name}, ${user?.age}, ${user?.city}
        ${user?.status}
      `)
      .setColor('#bbffd3')
      .setImage(user?.photo || null);

    const buttons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`RenameAbout_${user?.userId}`)
          .setLabel('Изменить обо мне')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`RenameYear_${user?.userId}`)
          .setLabel('Изменить возраст')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`RenameImage_${user?.userId}`)
          .setLabel('Изменить изображение')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId(`RecreateForm_${user?.userId}`)
          .setLabel('Пересоздать анкету')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(user?.disabledReports),
      );
    await interaction.reply({embeds: [embed], components: [buttons]});
  }
}
