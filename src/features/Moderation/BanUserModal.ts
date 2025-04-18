import {IFeature} from "../../lib/discord/Feature";
import {ModalSubmitInteraction} from "discord.js";
import {BotClient} from "../../lib/discord/Client";

export default class BanUserModal implements IFeature<ModalSubmitInteraction> {
  name = 'BanModal';
  run = async ({interaction, client}: { interaction: ModalSubmitInteraction, client: BotClient }) => {
    const id = interaction.customId.split('_')[1];
    const type = interaction.customId.split('_')[2];
    const reason = interaction.fields.getTextInputValue('reason');

    if (type === 'permanent') {
      await client.moderatorUsecase.ban(id, reason);
    } else {
      await client.moderatorUsecase.shadowBan(id, reason);
    }

    await interaction.deferUpdate();

    await interaction.editReply({
      components:[],
      content:`${interaction.message?.content}\n Забанил: ${interaction.user.username}`
    })

    // await interaction.followUp({
    //   ephemeral: true,
    //   content: 'Пользователь забанен.'
    // });
  };
}
