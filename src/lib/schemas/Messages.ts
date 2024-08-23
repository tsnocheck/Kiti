import {prop, Ref} from "@typegoose/typegoose";
import {User} from "./User";

export class Messages {
  @prop()
  message?: string;
  
  @prop({ref: () => User})
  from?: Ref<User>;

  @prop({ref: () => User})
  to?: Ref<User>;
}
