import { Module } from '@nestjs/common';
import { ClerkStrategy } from './clerk.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule, UsersModule, ConfigModule],
  controllers: [AuthController],
  providers: [ClerkStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
