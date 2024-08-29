import type {BotClient} from '../lib/discord/Client';
import {IFeature} from "../lib/discord/Feature";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Message,
  ModalSubmitInteraction
} from 'discord.js';
import uploadImage from "../lib/helpers/imgur";
import {Gender} from "../lib/schemas/User";

export default class CreateFormModal implements IFeature<ModalSubmitInteraction> {
  name = "CreateFormModal";

  async run({interaction, client}: { interaction: ModalSubmitInteraction, client: BotClient }): Promise<any> {
    await interaction.deferUpdate();
    await this.handleSex(interaction, client);
  }

  async handleSex(interaction: ModalSubmitInteraction, client: BotClient) {
    let sex: Gender;
    let embed = new EmbedBuilder()
      .setTitle('Выберите свой пол')
      .setDescription('Используйте эти кнопки, чтобы выбрать свой пол')
      .setColor('#bbffd3');

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Мужской')
          .setStyle(ButtonStyle.Primary)
          .setCustomId('male'),
        new ButtonBuilder()
          .setLabel('Женский')
          .setStyle(ButtonStyle.Primary)
          .setCustomId('female'),
      );

    const message = await interaction.editReply({embeds: [embed], components: [row]});

    let buttonFilter = (i: ButtonInteraction) => i.user.id === interaction.user.id;

    let buttonCollector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120 * 1000,
      filter: buttonFilter
    });

    buttonCollector.on('collect', async (i: ButtonInteraction) => {
      if (i.customId === 'male') {
        sex = Gender.Male;
      } else {
        sex = Gender.Female;
      }
      buttonCollector.stop('collected');
    });
    buttonCollector.on('end', async (_, reason) => {
      if (reason === 'collected') {
        await this.handleImage(interaction, client, sex);
      } else {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Анкета')
              .setDescription('Вы не успели выбрать свой пол, попробуйте создать анкету еще раз.')
              .setColor('#bbffd3')
              .setTimestamp()
          ]
        });
      }
    });
  }

  async handleImage(interaction: ModalSubmitInteraction, client: BotClient, sex: Gender) {
    const name = interaction.fields.getTextInputValue('name');
    let age = interaction.fields.getTextInputValue('age');
    const city = interaction.fields.getTextInputValue('city');
    const info = interaction.fields.getTextInputValue('info') || '';
    const embed = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription('Отправьте в чат ваше фото')
      .setFooter({text: 'У вас есть на это 2 минуты'})
      .setColor('#bbffd3');

    await interaction.editReply({embeds: [embed], components: []});

    const msgFilter = (msg: Message) => msg.author.id === interaction.user.id;
    const imageCollector = interaction.channel?.createMessageCollector({filter: msgFilter});
    imageCollector?.on('collect', async (message: Message) => {
      let msg = await message.fetch();
      const imageUrl: string | undefined = msg.attachments
        .find(attachment => attachment.contentType?.startsWith('image/'))?.url;

      if (!imageUrl) return interaction.followUp({content: 'Вы отправили не изображение', ephemeral: true});
      let urlImgur: string = await uploadImage(imageUrl);
      if (!urlImgur) return interaction.followUp({
        content: 'Не удалось загрузить фото, попробуйте еще раз',
        ephemeral: true
      });
      await message.delete();

      let ageMin = Math.min(Math.max(18, isNaN(parseInt(age)) ? 18 : parseInt(age)), 70);
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
      imageCollector.stop('stop');
    });
    imageCollector?.on('end', async (reason) => {
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

