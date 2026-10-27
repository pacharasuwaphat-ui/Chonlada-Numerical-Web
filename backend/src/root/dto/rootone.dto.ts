import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class RootOneDto {
  @IsString()
  userid:string;

  @IsString()
  equation:string;

  @IsString()
  method:string;

  @IsNumber()
  x0:number;

  @IsNumber()
  err:number;
}