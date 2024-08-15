import { IFeature } from "../lib/discord/Feature";
import { ButtonInteraction, ModalSubmitInteraction } from 'discord.js'

export default class createFormFeature implements IFeature<ModalSubmitInteraction> {
  name = "createForm";
  
  async run({ interaction }: { interaction: ModalSubmitInteraction }): Promise<any> {
    const name = interaction.fields.getTextInputValue('nameModal');
    const age = interaction.fields.getTextInputValue('ageModal');
    const city = interaction.fields.getTextInputValue('cityModal');
    const sex = interaction.fields.getTextInputValue('sexModal');
    const about = interaction.fields.getTextInputValue('sexModal');
    
    //TODO: у меня пиздец лагал комп, поэтому я не дописал эту хуйню, картинки буду ловить через коллектор и после создавать анкету
    //из плюсов, я смогу назначить время чтобы если шо снести ловлю атачмента, после либо ты либо я подключим api imgur
  }
}
