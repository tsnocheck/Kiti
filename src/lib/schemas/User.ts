import {prop} from '@typegoose/typegoose';

enum Gender {
  Male = 0,
  Female = 1,
  Gay = 2
}

class User {
  @prop({required: true})
  public userId!: string;

  @prop({default: false})
  public userAgreement!: boolean;

  @prop({required: true})
  public name!: string;

  @prop({required: true})
  public city!: string;

  @prop({required: true})
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
}

export {User};
