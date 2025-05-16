import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '@modules/user/user.module';
import { JwtAuthGuard } from './jwt.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'CAK_HARRYITC', // nên dùng .env
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
