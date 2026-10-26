import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class RootTwoDto {
  @IsString()
  userid:string;

  @IsString()
  equation:string;

  @IsString()
  method:string;

  @IsNumber()
  xl:number;

  @IsNumber()
  xr:number;

  @IsNumber()
  err:number;
}