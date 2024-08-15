import type { BotClient } from '../lib/discord/Client'
import {IPrecondition} from "../lib/discord/Precondition";
import {
  BaseInteraction, EmbedBuilder, GuildMember, RepliableInteraction
} from 'discord.js'
import { UserUsecase } from '../lib/usecases/UserUsecase'

export default class NicknamePrecondition implements IPrecondition {
  name ='NicknamePrecondition'

  async run({ interaction, client }: { interaction: BaseInteraction, client: BotClient }) {
    let user = await client.usercases?.findByUserId(interaction.user.id)
    console.log(user)
    if(user == null){
      let embed = new EmbedBuilder()
        .setTitle('Анкета')
        .setDescription('**Создавая анкету вы автоматически подписываете [Пользовательское соглашение](https://docs.google.com/document/d/1pnNdL2rUVqurlKscDZNy-ABdPw-ZfDdQXOlo6kwnxvM/edit#heading=h.czgykm6tiowt) и [Политику конфиденциальности](https://docs.google.com/document/d/1IVsThKB01CVMeXI551f5LfdV-ICi0-1_ydPyNukVB3c/edit#heading=h.w7quzb7fkv1l)**')
      await (interaction as RepliableInteraction).reply({embeds:[embed]});
      return false
    }
    return true
  }
}
