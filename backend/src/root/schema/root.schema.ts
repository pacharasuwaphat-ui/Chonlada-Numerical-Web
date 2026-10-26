
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RootDocument = Root & Document;

@Schema({
  timestamps: true,
  collection: 'root',
})
export class Root {
  @Prop({ required: true, trim: true })
  userId: string;

  @Prop({ required: true, trim: true })
  equation: string;

  @Prop({
    type: String, enum: ['1', '2'],required: true,
  })
  type: '1' | '2';

  @Prop({
    type: String, enum: ['graphical', 'bisection' , 'false-position' , 'one-point' , 'newton-raphson' , 'secant'],required: true,
  })
  method: string;

  @Prop({
    type: Number,
    required: function (this: Root) {
      return this.type === '2';
    },
  })
  xl?: number;

  @Prop({
    type: Number,
    required: function (this: Root) {
      return this.type === '2';
    },
  })
  xr?: number;

  @Prop({
    type: Number,
    required: function (this: Root) {
      return this.type === '1';
    },
  })
  x0?: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  err: number;
}

export const RootSchema = SchemaFactory.createForClass(Root);
