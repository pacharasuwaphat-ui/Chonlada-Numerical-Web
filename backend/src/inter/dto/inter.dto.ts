import { IsArray, IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export type InterpolationPoint = {
  x: number;
  fx: number;
};

export class InterDto {
  @IsString()
  userid:string;

  @IsString()
  method:string;

  @IsNumber()
  xValue:number;

  @IsNumber()
  numberOfPoints:number;

  @IsArray()
  Points:InterpolationPoint[];
}