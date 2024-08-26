import {Document, Model, Types} from "mongoose";
import {User} from "../schemas/User";
import {getModelForClass} from "@typegoose/typegoose";
import {Nullable} from "../helpers/types";
import {Likes} from "../schemas/Likes";
import {Messages} from "../schemas/Messages";
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

export interface RecreateFormDto {
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
  private messages: Model<Messages>;
  private client: BotClient;

  constructor(client: BotClient) {
    this.users = getModelForClass(User);
    this.likes = getModelForClass(Likes);
    this.messages = getModelForClass(Messages);
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

  async getRandomForm(userId: string) {
    const user = await this.findByUserId(userId);
    const count = await this.users.countDocuments({
      banned: {$ne: true},
      shadowBanned: {$ne: true},
      userId: {$nin: user?.viewed, $ne: userId}
    }).exec();
    const random = Math.floor(Math.random() * count);
    const [form] = await this.users
      .find({banned: {$ne: true}, shadowBanned: {$ne: true}, userId: {$nin: user?.viewed, $ne: userId}})
      .skip(random)
      .exec();

    await user?.updateOne({$push: {viewed: form?.userId}});

    return form;
  }

  async getFormForObjectId(objectId: Types.ObjectId) {
    return this.users.findOne({_id: objectId}).exec();
  }

  async getLikesForm(userId: string) {
    return this.likes.findOne({userId: userId}).exec();
  }

  async like(userId: string, likedUser: string): Promise<boolean> {
    let user = await this.findByUserId(userId);
    let member = await this.findByUserId(likedUser);
    await this.likes.findOneAndUpdate({userId}, {$push: {likedTo: member!._id}}, {new: true, upsert: true});
    await this.likes.findOneAndUpdate({userId: likedUser}, {$push: {likedBy: user!._id}}, {new: true, upsert: true});

    return true;
  }

  async deleteLikedByForm(likedBy: string, likedUserId: string) {
    const user = await this.findByUserId(likedUserId);
    const likedByUser = await this.findByUserId(likedBy);
    await this.likes.findOneAndUpdate({userId: likedUserId}, {$pull: {likedBy: likedByUser!._id}}, {
      new: true,
      upsert: true
    });
    return this.likes.findOneAndUpdate({userId: likedBy}, {$pull: {likedTo: user!._id}}, {upsert: true});
  }

  async addViewed(userId: string, viewedId: string) {
    return this.users.findOneAndUpdate({userId: userId}, {$push: {viewed: viewedId}});
  }

  async renameAbout(userId: string, text: string) {
    return this.users.findOneAndUpdate({userId: userId}, {status: text});
  }

  async renameImage(userId: string, image: string) {
    console.log(image)
    return this.users.findOneAndUpdate(
      { userId: userId },
      { photo: image },
      { new: true }
    );
  }

  async likeMessage(userId: string, likedUserId: string, message: string): Promise<boolean> {
    let user = await this.findByUserId(userId);
    let likedUserObj = await this.findByUserId(likedUserId);
    await this.messages.create({
      to: user?._id,
      from: likedUserObj?._id,
      message: message
    });
    return true;
  }

  async cleanUserMessages(userId: string, likedUserId: string) {
    let user = await this.findByUserId(userId);
    let likedUser = await this.findByUserId(likedUserId);
    await this.messages.deleteMany({to: likedUser?._id, from: user?._id}).exec();
  }

  async getMessage(userId: string, likedUserId: string) {
    let user = await this.findByUserId(userId);
    let likedUser = await this.findByUserId(likedUserId);

    const doc = await this.messages.findOne({to: likedUser?._id, from: user?.id}).exec();

    return doc?.message;
  }

  async recreateForm(dto: RecreateFormDto) {
    return this.users.findOneAndUpdate(
      {userId: dto.userId},
      {
        name: dto.name,
        sex: dto.sex,
        city: dto.city,
        age: dto.age,
        status: dto.status,
        image: dto.photo
      });
  }

  async renameYear(userId: string, year: number) {
    return this.users.findOneAndUpdate({userId: userId}, {year: year});
  }

  async clearViewed() {
    logger.info('Clearing viewed in users model');
    await this.users.updateMany({}, {$set: {viewed: []}}).exec();
  }

  async cleanLikes() {
    logger.info('Clearing liked in likes model.');
    await this.likes.updateMany({}, {$set: {likedTo: [], likedBy: []}}).exec();
  }

  async cleanMessages() {
    logger.info('Clearing messages in messages model.');
    await this.messages.deleteMany({}).exec();
  }
}
