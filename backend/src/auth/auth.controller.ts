import { User } from '@clerk/backend';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BEARER_TOKEN } from 'src/config';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@ApiBearerAuth(BEARER_TOKEN)
@Controller('auth')
export class AuthController {
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
