import type { BotClient } from '../../lib/discord/Client'
import {IFeature} from "../../lib/discord/Feature";
import {
  ButtonInteraction, EmbedBuilder, type User
} from 'discord.js'

export default class AcceptAppeal implements IFeature<ButtonInteraction> {
  name = "AcceptAppeal";
  
  async run({interaction, client}: { interaction: ButtonInteraction, client: BotClient }): Promise<any> {
    await client.userUsecase.unbannedUser(interaction.customId.split('_')[1])
    const member: User = await client.users.fetch(interaction.customId.split('_')[1]) as User;
    
    await interaction.update({content:'Пользователь разбанен', components:[]})
    try{
      await member?.send({
        embeds:[
          new EmbedBuilder()
            .setTitle('Анкета')
            .setDescription(`Ваша анкета была разблокирована, теперь вы можете дальше пользоваться ботом!`)
            .setColor(0x2b2d31)
            .setTimestamp()
        ]
      })
    }catch{
      await interaction.reply({content:'Я не смог отправить уведомление пользователю, попробуйте связаться с ним вручную.', ephemeral:true})
    }
  }
}
