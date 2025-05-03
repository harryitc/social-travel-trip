import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { ClerkClientProvider } from 'src/providers/clerk-client.provider';

@Module({
  providers: [UsersService, ClerkClientProvider],
  exports: [UsersService],
})
export class UsersModule {}
