import {BotClient} from "../discord/Client";
import {User} from "../schemas/User";
import {Model} from "mongoose";
import {getModelForClass} from "@typegoose/typegoose";

export class ModeratorUsecase {
  client: BotClient;
  users: Model<User>;

  constructor(client: BotClient) {
    this.client = client;
    this.users = getModelForClass(User);
  }

  async ban(userId: string, reason: string) {
    await this.users.findOneAndUpdate({userId: userId}, {banned: true, banReason: reason}, {upsert: true}).exec();
  }

  async shadowBan(userId: string, reason: string) {
    await this.users.findOneAndUpdate({userId: userId}, {shadowBanned: true, banReason: reason}, {upsert: true}).exec();
  }

  async unban(userId: string) {
    await this.users.findOneAndUpdate({userId: userId}, {banned: false, shadowBanned: false}, {upsert: true}).exec();
  }
}
