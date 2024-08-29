import type {BotClient} from '../../lib/discord/Client';
import {IFeature} from "../../lib/discord/Feature";
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
import imgur from '../../lib/helpers/imgur';
import {Gender} from "../../lib/schemas/User";

export default class RecreateFormModal implements IFeature<ModalSubmitInteraction> {
  name = "RecreateFormModal";

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
    let year = interaction.fields.getTextInputValue('age');
    const city = interaction.fields.getTextInputValue('city');
    const status = interaction.fields.getTextInputValue('info') || '';

    const embed = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription('Отправьте в чат ваше фото')
      .setFooter({text: 'У вас есть на это 2 минуты'})
      .setColor('#bbffd3');

    await interaction.editReply({embeds: [embed], components: []});

    const filter = (msg: Message) => msg.author.id === interaction.user.id;

    let collector = interaction.channel?.createMessageCollector({filter});
    collector?.on('collect', async (message: Message) => {
      let msg = await message.fetch();
      const imageUrl: string | undefined = msg.attachments
        .find(attachment => attachment.contentType?.startsWith('image/'))?.url;

      if (!imageUrl) return interaction.followUp({content: 'Вы отправили не изображение', ephemeral: true});
      let image: string = await imgur(imageUrl);
      if (!image) return interaction.followUp({
        content: 'Не удалось загрузить фото, попробуйте еще раз',
        ephemeral: true
      });
      // await message.delete();

      const userId = interaction.user.id;

      let age: number = Math.min(Math.max(18, isNaN(parseInt(year)) ? 18 : parseInt(year)), 70);
      await client.userUsecase.recreateForm({userId, name, sex, city, age, status, photo: image});
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Анкета')
            .setDescription('Вы успешно перезаполнили анкету.')
            .setColor('#bbffd3')
            .setTimestamp()
        ], components: []
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
