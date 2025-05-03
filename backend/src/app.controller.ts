import { Controller, Get, Req } from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@clerk/backend';

@Controller()
export class AppController {
  constructor() {}

  // @Public()
  @Get()
  getHello(@CurrentUser() user: User): any {
    console.log('req = ', user);
    return {
      user: user,
      data: 'app ne',
    };
  }
}
