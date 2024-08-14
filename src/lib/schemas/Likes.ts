import {prop} from "@typegoose/typegoose";
import {User} from "./User";

export class Likes {
  @prop()
  userId!: string;

  @prop({ ref: () => User })
  likedBy?: User[];

  @prop({ ref: () => User })
  likedTo?: User[];
}
