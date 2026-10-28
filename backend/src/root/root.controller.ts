import { Controller, Get, Post, Body, Patch, Param, Delete , Query } from '@nestjs/common';
import { RootService } from './root.service.js';

import { RootTwoDto} from './dto/roottwo.dto.js'
import { RootOneDto } from './dto/rootone.dto.js'

@Controller('root')
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @Post('two')
  SaveRoot(@Body() root: RootTwoDto) {
    return this.rootService.SaveRoot(root);
  }

  @Post('one')
  SaveRootOne(@Body() root: RootOneDto) {
    return this.rootService.SaveRootOne(root);
  }

  @Get('/:id/:method')
  GetRootById(@Param('id') UserId: string , @Param('method') method: string,) {
    return this.rootService.GetRootById(UserId , method);
  }  

  @Delete(':id/:userId')
  DeleteRoot( @Param('id') id: string , @Param('userId') userId: string,) {
    return this.rootService.DeleteRootById(id, userId);
  }
//   @Get('/findFortune/:id')
//   findFortuneById(@Param('id') fortuneId: string) {
//     return this.fortuneService.findFortuneById(fortuneId);
//   }


}
