import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService], //jwt strategy, roles guard -> todo
  exports: [AuthService] //roles guard --> todo
})
export class AuthModule {}
