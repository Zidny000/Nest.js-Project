import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async register(registerDto: RegisterDto){
    const existingUser = await this.usersRepository.findOne({
        where: {email: registerDto.email}
    })

    if(existingUser){
        throw new ConflictException('Email already in use! Please try with a diff email')
    }
    const hashedPassword = await this.hashPassword(registerDto.password);

    const newUser = this.usersRepository.create({
        
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        role: UserRole.USER
    });
    const savedUser = await this.usersRepository.save(newUser);
    return {user: savedUser, message : 'User registered successfully!'};
  }

  async createAdmin(registerDto: RegisterDto){
    const existingUser = await this.usersRepository.findOne({
        where: {email: registerDto.email}
    })

    if(existingUser){
        throw new ConflictException('Email already in use! Please try with a diff email')
    }
    const hashedPassword = await this.hashPassword(registerDto.password);

    const newUser = this.usersRepository.create({
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        role: UserRole.ADMIN
    });
    const savedUser = await this.usersRepository.save(newUser);
    return {user: savedUser, message : 'Admin created successfully!'};
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

}