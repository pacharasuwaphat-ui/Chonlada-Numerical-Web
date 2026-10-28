import { Controller, Get, Post, Body, Patch, Param, Delete , Query } from '@nestjs/common';
import { InterService } from './inter.service.js';

import { InterDto } from './dto/inter.dto.js'

@Controller('inter')
export class InterController {
  constructor(private readonly interService: InterService) {}

  @Post('save')
  SaveRoot(@Body() root: InterDto) {
    return this.interService.SaveInter(root);
  }

  @Get('/:id/:method')
  GetRootById(@Param('id') UserId: string , @Param('method') method: string,) {
    return this.interService.GetInterById(UserId , method);
  }  

  @Delete(':id/:userId')
  DeleteRoot( @Param('id') id: string , @Param('userId') userId: string,) {
    return this.interService.DeleteInterById(id, userId);
  }
//   @Get('/findFortune/:id')
//   findFortuneById(@Param('id') fortuneId: string) {
//     return this.fortuneService.findFortuneById(fortuneId);
//   }


}
