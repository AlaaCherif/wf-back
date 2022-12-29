import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Header, Headers, Put } from '@nestjs/common/decorators';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import {
  CreateUserDto,
  LoginDto,
  UpdateUserDto,
} from 'src/schemas/user.schema';
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
  //get user by email
  @Get('/user/:email')
  async getUser(@Param('email') email: string, @Res() response) {
    const user = await this.userService.getUser(email);
    response.json(user);
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
  @Put('update')
  async updateUser(
    @Res() response,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('authorization') token: string,
  ) {
    const tokenContent = this.tokenService.verifyToken(token.split(' ')[1]);
    if (tokenContent.email !== updateUserDto.email)
      throw new ForbiddenException();
    const newUser = await this.userService.updateUser(updateUserDto);
    if (!newUser) throw new NotFoundException('User not found');
    const newToken = this.tokenService.createToken(newUser.toObject());
    return response.json({
      _id: newUser._id,
      name: newUser.name,
      lastName: newUser.lastName,
      email: newUser.email,
      gender: newUser.gender,
      token: newToken,
    });
  }
}
