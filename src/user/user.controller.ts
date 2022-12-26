import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginDto } from 'src/schemas/user.schema';
import { TokenService } from './token/token.service';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}
  @Get()
  async getUsers(@Res() response) {
    const users = await this.userService.getUsers();
    return response.json(users);
  }
  @Post()
  async createUser(@Res() response, @Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);
    if (!newUser) throw new UnauthorizedException('Email taken');
    const token = this.tokenService.createToken(newUser.toObject());
    return response.json({
      _id: newUser._id,
      name: newUser.name,
      lastName: newUser.lastName,
      email: newUser.email,
      gender: newUser.gender,
      token,
    });
  }
  @Post('login')
  async login(@Res() response, @Body() loginDto: LoginDto) {
    const user = await this.userService.login(loginDto);
    if (!user) throw new UnauthorizedException('Incorrect credentials');
    const token = this.tokenService.createToken(user.toObject());
    return response.json({
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      token,
    });
  }
}
