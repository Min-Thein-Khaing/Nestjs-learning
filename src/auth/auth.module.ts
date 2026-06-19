import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './provider/auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BcryptProvider },
  ],
  imports: [forwardRef(() => UsersModule)],
  exports: [AuthService, HashingProvider],
})
export class AuthModule {}
