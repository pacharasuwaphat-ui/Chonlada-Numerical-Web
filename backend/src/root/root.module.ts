import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Root , RootSchema } from './schema/root.schema.js'
import { RootController } from './root.controller.js';
import { RootService } from './root.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Root.name, schema: RootSchema },
    ]),
  ],
  controllers: [RootController],
  providers : [RootService],
  exports: [MongooseModule],
})
export class RootModule {}