import {Document, Model} from "mongoose";
import {User} from "../schemas/User";
import {getModelForClass} from "@typegoose/typegoose";
import {Nullable} from "../helpers/types";
import {Likes} from "../schemas/Likes";
import {BotClient} from "../discord/Client";
import {logger} from "../services/logger";

export interface CreateFormDto {
  userId: string;
  name: string;
  sex: string;
  city: string;
  age: number;
  status?: string;
  photo?: string;
  findSex?: number;
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
    const form = await this.users.create(dto);
    logger.info('Created form', form);
    return form;
  }

  async findByUserId(userId: string) {
    return this.users.findOne({userId: userId}).exec();
  }

  async unbannedUser(userId: string) {
    await this.likes.findOneAndUpdate({userId}, {banned: false}, {new: true, upsert: true});
    return true;
  }


  async getRandomForm(userId: string) {
    const count = await this.users.countDocuments({
      banned: {$ne: true},
      shadowBanned: {$ne: true},
      userId: {$ne: userId}
    });
    const user = await this.findByUserId(userId);

    const form = await this.users
      .findOne({banned: {$ne: true}, shadowBanned: {$ne: true}, userId: {$nin: user?.viewed, $ne: userId}})
      .exec();

    await user?.updateOne({$push: {viewed: form?.userId}});

    return form;
  }

  async getFormForObjectId(objectId: any) {
    return this.users.findOne({_id: objectId}).exec();
  }

  async getLikesForm(userId: string) {
    return this.likes.findOne({userId: userId}).exec();
  }

  async like(userId: string, likedUser: string): Promise<boolean> {
    let user = await this.findByUserId(userId);
    let member = await this.findByUserId(likedUser);
    await this.likes.findOneAndUpdate({userId}, {$push: {likedTo: member}}, {new: true, upsert: true});
    await this.likes.findOneAndUpdate({userId: likedUser}, {$push: {likedBy: user}}, {new: true, upsert: true});

    return true;
  }

  async deleteLikedToForm(objectId: any, userId: string): Promise<boolean> {
    return this.likes.findOneAndUpdate({userId}, {$pull: {likedTo: objectId}}, {new: true, upsert: true});
  }

  async report(formId: string): Promise<boolean> {
    return true;
  }
}
