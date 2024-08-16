import {IFeature} from "../lib/discord/Feature";
import {ModalSubmitInteraction} from 'discord.js';

export default class CreateFormModal implements IFeature<ModalSubmitInteraction> {
  name = "CreateFormModal";

  async run({interaction}: { interaction: ModalSubmitInteraction }): Promise<any> {
    const name = interaction.fields.getTextInputValue('name');
    const age = interaction.fields.getTextInputValue('age');
    const city = interaction.fields.getTextInputValue('city');
    const sex = interaction.fields.getTextInputValue('sex');
    const info = interaction.fields.getTextInputValue('info');

    //TODO: у меня пиздец лагал комп, поэтому я не дописал эту хуйню, картинки буду ловить через коллектор и после создавать анкету
    //из плюсов, я смогу назначить время чтобы если шо снести ловлю атачмента, после либо ты либо я подключим api imgur
  }
}
