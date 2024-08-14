import {Document, Model} from "mongoose";
import {User} from "../schemas/User";
import {getModelForClass} from "@typegoose/typegoose";
import {Nullable} from "../helpers/types";
import {Likes} from "../schemas/Likes";

export interface CreateFormDto {
  name: string;
  sex: string;
  age: number;
  status?: string;
  photo?: string;
}

export class UserUsecase {
  users: Model<User>
  likes: Model<Likes>
  constructor() {
    this.users = getModelForClass(User);
    this.likes = getModelForClass(Likes);
  }

  async createForm(dto: CreateFormDto ): Promise<Nullable<Document>> {
    const form = await this.users.create(dto);
    return form;
  }

  async getRandomForm(): Promise<Nullable<Document>>{
    const count = await this.users.countDocuments();

    const form = await this.users.findOne().skip(Math.round(Math.random() * count))
    return form;
  }
  
  async like(userId: string, likedUser: string): Promise<boolean> {
    const form = await this.users.findOneAndUpdate({userId}, {$push: {likedBy: likedUser}}, { new: true, upsert: true });
    return true;
  }

  async report(formId: string): Promise<boolean> {
    return true;
  }
}
