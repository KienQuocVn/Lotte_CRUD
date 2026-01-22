import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import User from '../users/entities/user.entity';
import { HashService } from './crypto/hash';
import { RegisterDto, SignInDto } from './dto/register.dto';
import { Role } from '../users/roles/role.enum';

@Injectable()
export class AuthService {
  private hashService: HashService;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {
    this.hashService = new HashService();
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new UnauthorizedException('Email hoặc password không đúng');
    }

    // So sánh password đã hash
    const isPasswordValid = await this.hashService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc password không đúng');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      roles: user.roles,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone } = registerDto;

    // Kiểm tra user đã tồn tại
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email đã được đăng ký');
    }

    // Hash password
    const hashedPassword = await this.hashService.hashPassword(password);

    // Tạo user mới với role mặc định là 'user'
    const newUser = new this.userModel({
      name,
      email,
      phone,
      password: hashedPassword,
      roles: [Role.User],
    });

    const savedUser = await newUser.save();

    return {
      message: 'Đăng ký thành công',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        roles: savedUser.roles,
      },
    };
  }
}
