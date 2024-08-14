import type { Model } from 'mongoose'
import { User } from '../schemas/User'

interface UserCreate {
  name: string;
  sex: string;
  age:number;
  photo: string;
  status?: string;
}

class UserUsecase {
  model: Model<User>
  
  constructor(model: Model<User>) {
    this.model = model
  }
  
  async createForm(userId: string, dto: UserCreate){
    const { _id: id } = await this.model.create({
      name: dto.name,
      sex: dto.sex,
      age: dto.age,
      status: dto.status || null,
      photo: dto.photo
    });
  }
  
  async getRandomForm(userId: string){
  
  }
  
  async likeForm(){
  
  }
  
  async messageForm(){
  
  }
  
  async recreateForm(){
  
  }
  
  async sendReport(){
  
  }
}
