import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  ConfirmResetPasswordDTO,
} from './dto/auth.dto';

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

  @ApiResponse({
    status: 201,
    schema: {
      example: { user_id: 1, username: 'harryitc' },
    },
  })
  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.authService.register(
      body.username,
      body.password,
      body.full_name,
      body.email,
    );
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: { message: 'Password reset email sent' },
    },
  })
  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDTO) {
    return this.authService.resetPassword(body.email);
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: { message: 'Password reset successful' },
    },
  })
  @Post('reset-password/confirm')
  confirmResetPassword(@Body() body: ConfirmResetPasswordDTO) {
    return this.authService.confirmResetPassword(body.token, body.password);
  }
}
