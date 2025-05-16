import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    schema: {
      example: { access_token: 'your.jwt.token' },
    },
  })
  @Post('login')
  login(@Body() body: LoginDTO) {
    return this.authService.login(body.username, body.password);
  }

  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.authService.register(body.username, body.password);
  }
}
