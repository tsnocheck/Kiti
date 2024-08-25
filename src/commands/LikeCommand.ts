import {ICommand} from "../lib/discord/Command";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder} from 'discord.js';
import {BotClient} from "../lib/discord/Client";

export default class FindCommand implements ICommand {
  name = 'like';
  description = 'Посмотреть список лайков';
  preconditions = ['CheckForm', 'AppealForm'];

  async run({interaction, client}: { interaction: CommandInteraction, client: BotClient }) {
    let likesForm = await client.userUsecase.getLikesForm(interaction.user.id)
    
    if (interaction.deferred || interaction.replied) return;

    if (!likesForm?.likedBy || likesForm.likedBy.length === 0) {
      await interaction.reply({content:'К сожалению вас никто еще не лайкнул, попробуйте чуть позже', ephemeral:true})
      return
    }

    let form = await client.userUsecase.getFormForObjectId(likesForm.likedBy[0]._id);
    const message = await client.userUsecase.getMessage(interaction.user.id, form!.userId);
    let embed = new EmbedBuilder()
      .setTitle('Анкета')
      .setDescription(`
        **Вас лайкнул пользователь:**
      
        ${form?.name}, ${form?.age}, ${form?.city}
        ${form?.status}
        
        ${message ? message : ''}
      `)
      .setColor('#bbffd3')
      .setImage(form?.photo || null);
    
    let button = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`LikeBtn_${form?.userId}`)
          .setEmoji('<:likeIcon:1273558975966744620>')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`DislikeBtn_${form?.userId}`)
          .setEmoji('<:dislikeIcon:1273559004014055497>')
          .setStyle(ButtonStyle.Danger),
      )
    
    await interaction.reply({embeds:[embed], components:[button]})
  }
}
