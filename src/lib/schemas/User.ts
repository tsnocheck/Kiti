import {prop} from '@typegoose/typegoose';

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

  @prop({required: true})
  public photo!: string;
}

export {User};
