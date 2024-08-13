import { prop, Ref } from '@typegoose/typegoose';
import { Form } from './Form'
class User {
	@prop({ required: true })
	public userId!: string;
	
	@prop({ default: false })
	public userAgreement!: boolean;
	
	@prop({ ref: () => Form, default: null })
	public form?: Ref<Form>;
}

export { User }
