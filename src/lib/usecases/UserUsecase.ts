import {Document, Model} from "mongoose";
import {User} from "../schemas/User";
import {getModelForClass} from "@typegoose/typegoose";
import {Nullable} from "../helpers/types";
import {Likes} from "../schemas/Likes";
import {BotClient} from "../discord/Client";

export interface CreateFormDto {
  userId: string;
  name: string;
  sex: string;
  city: string;
  age: number;
  status?: string;
  photo?: string;
}

export class UserUsecase {
  private users: Model<User>;
  private likes: Model<Likes>;
  private client: BotClient;

  constructor(client: BotClient) {
    this.users = getModelForClass(User);
    this.likes = getModelForClass(Likes);
    this.client = client;
  }

  async createForm(dto: CreateFormDto): Promise<Nullable<Document>> {
    return await this.users.create(dto);
  }

  async findByUserId(userId: string) {
    return this.users.findOne({userId: userId}).exec();
  }

  async getRandomForm() {
    const count = await this.users.countDocuments();

    return this.users.findOne().skip(Math.round(Math.random() * count));
  }

  async like(userId: string, likedUser: string): Promise<boolean> {
    let user = await this.findByUserId(userId);
    let member = await this.findByUserId(likedUser);
    await this.likes.findOneAndUpdate({userId}, {$push: {likedTo: user}}, {new: true, upsert: true});
    await this.likes.findOneAndUpdate({userId: likedUser}, {$push: {likedBy: member}}, {new: true, upsert: true});

    return true;
  }

  async report(formId: string): Promise<boolean> {
    return true;
  }
}
