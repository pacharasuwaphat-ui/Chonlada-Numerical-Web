import { InterDto } from './dto/inter.dto.js';

import { Inter, InterDocument } from './schema/inter.schema.js';
import { User } from '../users/schema/users.schema.js';

import { Model , Types  } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InterService {
  constructor(
    @InjectModel(Inter.name)
    private InterModel: Model<InterDocument>,

    // @InjectModel(User.name)
    // private userModel: Model<User>,

  ) {}

  async SaveInter(root: InterDto) {
    const { userid  , xValue , method , numberOfPoints , Points} = root; 
    // console.log('hello')
    const existingRoot = await this.InterModel.findOne({
      userId: userid,
      xValue: xValue,
      numberOfPoints: numberOfPoints,
      Points: Points,
      method : method,
    }).exec();

    if (existingRoot) {
      return {
        success: false,
        message: 'Copy Equation',
        data: existingRoot,
      };
    }

    const newRoot = await this.InterModel.create({
      userId: userid,
      method : method,
      xValue: xValue,
      numberOfPoints: numberOfPoints,
      Points: Points,
    });
  }

  async GetInterById(UserId: string , method : string) {
    const history = await this.InterModel
      .find({ userId: UserId , 
              method: method})
      .sort({ createdAt: -1 }) // 🔥 ใหม่ → เก่า
      .exec();

    return history;
    
    // Here you can implement your logic to generate a fortune based on the card detail
  }

  async DeleteInterById(id: string, userId: string) {

    const deleted = await this.InterModel.findOneAndDelete({
      _id: id,
      userId: userId,
    }).exec();

    if(!deleted){
      return{
        success: false,
        message: 'cannot delete',
      }
    }
    return {
      success: true,
      message: 'deleted',
    };

  }
}