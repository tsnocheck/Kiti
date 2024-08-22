import {prop} from "@typegoose/typegoose";

export class Advert {
  @prop()
  name!: string;

  @prop()
  text!: string;

  @prop()
  link!: string;

  @prop()
  button!: string;

  @prop()
  imageUrl!: string;
}
