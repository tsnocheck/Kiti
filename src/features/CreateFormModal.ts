import type {BotClient} from '../lib/discord/Client';
import {IFeature} from "../lib/discord/Feature";
import {EmbedBuilder, Message, ModalSubmitInteraction} from 'discord.js';
import imgur from '../lib/helpers/imgur';

export default class CreateFormModal implements IFeature<ModalSubmitInteraction> {
  name = "CreateFormModal";

  async run({interaction, client}: { interaction: ModalSubmitInteraction, client: BotClient }): Promise<any> {
    const name = interaction.fields.getTextInputValue('name');
    let age = interaction.fields.getTextInputValue('age');
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
      await message.delete();

      let ageMin = Math.max(18, isNaN(parseInt(age)) ? 18 : parseInt(age));
      await client.userUsecase.createForm({
        userId: interaction.user.id,
        name: name,
        sex: sex,
        city: city,
        age: ageMin,
        status: info,
        photo: String(urlImgur)
      });
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Анкета')
            .setDescription('Вы успешно создали анкету, для поиска введите команду /find')
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
