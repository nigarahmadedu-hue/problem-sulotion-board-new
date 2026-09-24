import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Profile } from '../profiles/profile.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.profilesRepository.findOne({ where: { email: registerDto.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const profile = this.profilesRepository.create({
      email: registerDto.email,
      password_hash: hashedPassword,
      name: registerDto.name,
      initials: registerDto.initials,
      role: registerDto.role,
      role_category: registerDto.role_category,
    });

    await this.profilesRepository.save(profile);

    const payload = { sub: profile.id, email: profile.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
      }
    };
  }

  async login(loginDto: LoginDto) {
    const profile = await this.profilesRepository.findOne({ where: { email: loginDto.email } });
    if (!profile || !profile.password_hash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, profile.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: profile.id, email: profile.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
      }
    };
  }
}
