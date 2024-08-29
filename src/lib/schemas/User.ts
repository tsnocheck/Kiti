import {prop} from '@typegoose/typegoose';
import {Types} from "mongoose";

export enum Gender {
  Male = "Male",
  Female = "Female",
  All = "All"
}

class User {
  @prop({required: true})
  public userId!: string;

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public city!: string;

  @prop({required: true, enum: Gender})
  public sex!: string;

  @prop({required: true})
  public age!: number;

  @prop({default: ''})
  public status?: string;

  @prop()
  public photo!: string;

  @prop({default: false})
  public banned!: boolean;

  @prop({enum: Gender})
  public findEnum!: Gender;

  @prop({default: false})
  public shadowBanned!: boolean;

  @prop({default: ''})
  public banReason!: string;

  @prop({default: [], type: Types.Array})
  public viewed!: string[];

  @prop({default: false})
  public disabledReports!: boolean;
}

export {User};
