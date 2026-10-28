
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InterDocument = Inter & Document;

export type InterpolationPoint = {
  x: number;
  fx: number;
};

@Schema({
  timestamps: true,
  collection: 'Interpolation',
})
export class Inter {
  @Prop({ required: true, trim: true })
  userId: string;

  @Prop({
    type: String, enum: ['newton-divided', 'lagrange' , 'spline'],required: true,
  })
  method: string;

  @Prop({ type: Number, required:true })
  xValue: number;

  @Prop({ type: Number, required: true, min: 2 })
  numberOfPoints: number;

  @Prop({ type: Array, required:true })
  Points: InterpolationPoint[];

}

export const InterSchema = SchemaFactory.createForClass(Inter);
