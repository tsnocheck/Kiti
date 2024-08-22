import {prop, Ref} from "@typegoose/typegoose";
import {User} from "./User";

export class Likes {
  @prop()
  userId!: string;

  @prop({ref: () => User})
  likedBy?: Ref<User>[];

  @prop({ref: () => User})
  likedTo?: Ref<User>[];
}
