import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from '../users/decorators/role.decorator';
import { Role } from '../users/roles/role.enum';
import { User } from '../users/decorators/user.decorator';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { RegisterDto, SignInDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const result = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    return {
      message: 'Đăng nhập thành công',
      ...result,
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@User() user: JwtPayload) {
    return {
      message: 'Thông tin user từ JWT token',
      user: user,
    };
  }

  // API chỉ admin mới truy cập được - Xem tất cả users
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('users')
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return {
      message: 'Danh sách tất cả users',
      users: users,
    };
  }

  // API chỉ admin mới xóa được user
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @User() user: JwtPayload) {
    await this.usersService.remove(id);
    return {
      message: 'Xóa user thành công',
      deletedUserId: id,
    };
  }
}
