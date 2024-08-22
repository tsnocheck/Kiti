import {Advert} from "../schemas/Advert";
import {getModelForClass} from "@typegoose/typegoose";
import {Model} from "mongoose";

export class AdvertUsecase {
  model: Model<Advert>;

  constructor() {
    this.model = getModelForClass(Advert);
  }

  async getRandomAdvert() {
    const count = await this.model.countDocuments();

    const advert = await this.model
      .find()
      .skip(Math.floor(Math.random() * count))
      .exec();

    return advert[0];
  }
}
