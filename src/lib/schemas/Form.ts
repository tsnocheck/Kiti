import { prop, Ref } from '@typegoose/typegoose';
import { User } from './User'
class Form {
	@prop({ required: true })
	public name!: string;
	
	@prop({ required: true })
	public sex!: string;
	
	@prop({ required: true })
	public age!: number;
	
	@prop()
	public status!: string;
	
	@prop({ required: true })
	public photo!: string;
  
  @prop({ ref: () => User })
  public like?: Ref<User>[];
	
	@prop({ ref: () => User})
	public visiting?: Ref<User>[];
}

export { Form }
