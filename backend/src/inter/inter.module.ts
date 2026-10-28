import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inter , InterSchema } from './schema/inter.schema.js'
import { InterController } from './inter.controller.js';
import { InterService } from './inter.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inter.name, schema: InterSchema },
    ]),
  ],
  controllers: [InterController],
  providers : [InterService],
  exports: [MongooseModule],
})
export class InterModule {}