import type { BotClient } from '../lib/discord/Client'
import {IPrecondition} from "../lib/discord/Precondition";
import {
  ActionRowBuilder,
  BaseInteraction, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, RepliableInteraction
} from 'discord.js'
import { UserUsecase } from '../lib/usecases/UserUsecase'

export default class NicknamePrecondition implements IPrecondition {
  name ='NicknamePrecondition';

  async run({ interaction, client }: { interaction: BaseInteraction, client: BotClient }) {
    let user = await client.usercases?.findByUserId(interaction.user.id)
    
    if(interaction.isMessageComponent()){
      if(interaction.message.interaction?.user.id != interaction.user.id){
        await (interaction as RepliableInteraction).reply({content:'Не ваше меню', ephemeral:true});
        return false
      }
    }
    
    if(user == null){
      let button = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('createForm')
            .setLabel('Создать анкету')
            .setStyle(ButtonStyle.Success)
        )
      
      let embed = new EmbedBuilder()
        .setTitle('Анкета')
        .setColor(0x2b2d31)
        .setDescription('**Создавая анкету вы автоматически подписываете [Пользовательское соглашение](https://docs.google.com/document/d/1pnNdL2rUVqurlKscDZNy-ABdPw-ZfDdQXOlo6kwnxvM/edit#heading=h.czgykm6tiowt) и [Политику конфиденциальности](https://docs.google.com/document/d/1IVsThKB01CVMeXI551f5LfdV-ICi0-1_ydPyNukVB3c/edit#heading=h.w7quzb7fkv1l)**')
      await (interaction as RepliableInteraction).reply({embeds:[embed], components:[button]});
      return false
    }
    return true
  }
}
