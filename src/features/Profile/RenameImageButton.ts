import type {BotClient} from '../../lib/discord/Client';
import {IFeature} from "../../lib/discord/Feature";
import {
  ActionRowBuilder,
  ButtonInteraction,
  EmbedBuilder, Message,
  ModalBuilder, type ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
  type User
} from 'discord.js'
import imgur from '../../lib/helpers/imgur'

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
    
    let collector = interaction.channel?.createMessageCollector({filter});
    collector?.on('collect', async (message: Message) => {
      let msg = await message.fetch();
      const imageUrl: string | undefined = msg.attachments
        .find(attachment => attachment.contentType?.startsWith('image/'))?.url;
      
      if (!imageUrl) return interaction.followUp({content: 'Вы отправили не изображение', ephemeral: true});
      let urlImgur: void = await imgur(imageUrl);
      if(urlImgur == undefined) return interaction.followUp({content: 'Не удалось загрузить фото, попробуйте еще раз', ephemeral: true});
      await client.userUsecase.renameImage(interaction.user.id, urlImgur)
      await message.delete();

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
            .setDescription('К сожалению время вышло, попробуйте еще раз.')
            .setColor('#bbffd3')
            .setTimestamp()
        ]
      });
    });
  }
}
