import { RootTwoDto } from './dto/roottwo.dto.js';
import { RootOneDto } from './dto/rootone.dto.js'

import { Root, RootDocument } from './schema/root.schema.js';
import { User } from '../users/schema/users.schema.js';

import { Model , Types  } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RootService {
  constructor(
    @InjectModel(Root.name)
    private rootModel: Model<RootDocument>,

    // @InjectModel(User.name)
    // private userModel: Model<User>,

  ) {}

  async SaveRoot(root: RootTwoDto) {
    const { userid , equation , xl , xr , method , err} = root; 
    // console.log('hello')
    const existingRoot = await this.rootModel.findOne({
      userId: userid,
      equation: equation,
      xl: xl,
      xr: xr,
    }).exec();

    if (existingRoot) {
      return {
        success: false,
        message: 'Copy Equation',
        data: existingRoot,
      };
    }

    const newRoot = await this.rootModel.create({
      userId: userid,
      type: '2',
      equation: equation,
      method : method,
      xl : xl,
      xr : xr,
      err : err,

    });
  }
  async SaveRootOne(root: RootOneDto) {
    const { userid , equation , x0  , method , err} = root; 
    // console.log('hello')
    const existingRoot = await this.rootModel.findOne({
      userId: userid,
      equation: equation,
      x0: x0,
    }).exec();

    if (existingRoot) {
      return {
        success: false,
        message: 'Copy Equation',
        data: existingRoot,
      };
    }

    const newRoot = await this.rootModel.create({
      userId: userid,
      type: '2',
      equation: equation,
      method : method,
      x0 : x0,
      err : err,

    });
  }

  async GetRootById(UserId: string , method : string) {
    const history = await this.rootModel
      .find({ userId: UserId , 
              method: method})
      .sort({ createdAt: -1 }) // 🔥 ใหม่ → เก่า
      .exec();

    return history;
    
    // Here you can implement your logic to generate a fortune based on the card detail
  }

  async DeleteRootById(id: string, userId: string) {

    const deleted = await this.rootModel.findOneAndDelete({
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