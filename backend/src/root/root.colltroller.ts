import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RootService } from './root.service.js';

import { RootTwoDto} from './dto/roottwo.dto.js'

@Controller('root')
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @Post('two')
  SaveRoot(@Body() root: RootTwoDto) {
    return this.rootService.SaveRoot(root);
  }

  @Get('/two/:id/:method')
  GetRootById(@Param('id') UserId: string , @Param('method') method: string,) {
    return this.rootService.GetRootById(UserId , method);
  }  

//   @Get('/findFortune/:id')
//   findFortuneById(@Param('id') fortuneId: string) {
//     return this.fortuneService.findFortuneById(fortuneId);
//   }


}
