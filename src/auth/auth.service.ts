import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
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

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
        where: { email: loginDto.email }
    })

    if(!user || !(await this.verifyPassword(loginDto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials! Please try again')
    }
    const tokens = this.generateTokens(user);
    const { password, ...result } = user;
    return { user: result, ...tokens, ...tokens };
  }

  async getUserById(id: number){
    const user = await this.usersRepository.findOne({
      where : {id}
    })
    if(!user){
      throw new UnauthorizedException('User not found')
    }
    const { password, ...result } = user;
    return result;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateTokens(user: User) {
    
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  private generateAccessToken(user: User): string {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role
    }
    return this.jwtService.sign(payload,{
      secret: 'jwt-secret-key',
      expiresIn: '15m'
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
    }
    return this.jwtService.sign(payload,{
      secret: 'jwt-secret-key',
      expiresIn: '7d'
    });
  }

  async refreshToken(refreshToken: string){
    try{
      const payload = this.jwtService.verify(refreshToken, {
        secret : 'refresh_secret'
      })

      const user = await this.usersRepository.findOne({
        where: {id: payload.sub}
      })

      if(!user){
        throw new UnauthorizedException('Invalid token')
      }

      const accessToken = this.generateTokens(user);
      return { accessToken };

    }catch(e){
      throw new UnauthorizedException('Invalid token')
    }
  }
}