import type {BotClient} from '../../lib/discord/Client';
import {IFeature} from "../../lib/discord/Feature";
import {ButtonInteraction, EmbedBuilder, Message} from 'discord.js';
import imgur from '../../lib/helpers/imgur';
import {logger} from "../../lib/services/logger";

export default class RenameImageModal implements IFeature<ButtonInteraction> {
  name = "RenameImage";

  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    let embed = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription('Отправьте в чат ваше фото')
      .setFooter({text: 'У вас есть на это 2 минуты'})
      .setColor('#bbffd3');
    
    await interaction.deferUpdate();
    await interaction.editReply({embeds: [embed], components: []});
    
    const filter = (msg: Message) => msg.author.id === interaction.user.id;

    await client.channels.fetch(interaction.channelId!);
    
    let collector = interaction.channel?.createMessageCollector({filter});
    collector?.on('collect', async (message: Message) => {
      let msg = await message.fetch();
      const imageUrl: string | undefined = msg.attachments
        .find(attachment => attachment.contentType?.startsWith('image/'))?.url;
      
      if (!imageUrl) return interaction.followUp({content: 'Вы отправили не изображение', ephemeral: true});
      let urlImgur: string = await imgur(imageUrl);
      if(!urlImgur) return interaction.followUp({content: 'Не удалось загрузить фото, попробуйте еще раз', ephemeral: true});
      await client.userUsecase.renameImage(interaction.user.id, urlImgur)
      try {
        await message.delete();
      } catch (e) {
        logger.info(`Can't delete message in guild ${interaction.guildId}`);
      }

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Анкета')
            .setDescription('Вы успешно изменили вашу фотографию.')
            .setColor('#bbffd3')
            .setTimestamp()
        ]
      });
      collector.stop('stop');
    });
    collector?.on('end', async (reason) => {
      if (reason) return;
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Анкета')
            .setDescription('Вы не успели прислать свое фото, попробуйте еще раз.')
            .setColor('#bbffd3')
            .setTimestamp()
        ]
      });
    });
  }
}
