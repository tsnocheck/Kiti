import type {BotClient} from '../../lib/discord/Client';
import {IFeature} from "../../lib/discord/Feature";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  type ModalSubmitInteraction,
  TextChannel
} from 'discord.js';

export default class CreateAppealModal implements IFeature<ModalSubmitInteraction> {
  name = "CreateAppealModal";
  preconditions = ['AuthorPrecondition'];

  async run({interaction, client}: { interaction: ModalSubmitInteraction, client: BotClient }): Promise<any> {
    const appealText = interaction.fields.getTextInputValue('appealText');
    let form = await client.userUsecase?.findByUserId(interaction.customId.split('_')[1]);

    let embedOne = new EmbedBuilder()
      .setTitle('Аппеляция')
      .setDescription(`Текст апелляции:\n \`\`\`${appealText}\`\`\``)
      .setImage('https://cdn.discordapp.com/attachments/772218365413818428/1079003352408543302/11112.png?ex=66c32dae&is=66c1dc2e&hm=bd3376a85cd96997b02c0d714b0a5c5d1c1dded3fd3d4336c56ead70fbc09929&')
      .setColor('#bbffd3')
      .setTimestamp();

    let embedTwo = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription(`
        ${form?.name}, ${form?.age}, ${form?.city}
        ${form?.status}
      `)
      .setColor('#bbffd3')
      .setImage(form?.photo || null);

    let button = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`AcceptAppeal_${form?.userId}`)
          .setLabel('Разбанить пользователя')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`CloseAppeal_${form?.userId}`)
          .setLabel('Отконить апелляцию')
          .setStyle(ButtonStyle.Danger)
      );

    let channel = client.channels.cache.get('1273697667599437864') as TextChannel;
    await channel?.send({embeds: [embedOne, embedTwo], components: [button]});
    await interaction.reply({content: 'Вы успешно подали апелляцию', ephemeral: true});
  }
}
