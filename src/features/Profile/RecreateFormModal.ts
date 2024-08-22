import type {BotClient} from '../../lib/discord/Client';
import {IFeature} from "../../lib/discord/Feature";
import {EmbedBuilder, Message, ModalSubmitInteraction} from 'discord.js';
import imgur from '../../lib/helpers/imgur';

export default class RecreateFormModal implements IFeature<ModalSubmitInteraction> {
  name = "RecreateFormModal";

  async run({interaction, client}: { interaction: ModalSubmitInteraction, client: BotClient }): Promise<any> {
    const name = interaction.fields.getTextInputValue('name');
    const age = interaction.fields.getTextInputValue('age');
    const city = interaction.fields.getTextInputValue('city');
    const sex = interaction.fields.getTextInputValue('sex');
    const info = interaction.fields.getTextInputValue('info') || '';

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
      await message.delete();

      await client.userUsecase.recreateForm(interaction.user.id, name, sex, city, age, info, String(urlImgur));
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Анкета')
            .setDescription('Вы успешно перезаполнили анкету.')
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
