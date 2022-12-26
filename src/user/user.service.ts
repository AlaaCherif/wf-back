import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  LoginDto,
  User,
  UserDocument,
} from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token/token.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private tokenService: TokenService,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const foundUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (foundUser) return null;
    const saltOrRounds = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    const createdUser = await new this.userModel(createUserDto).save();
    return createdUser;
  }
  async getUser(id: string): Promise<User[]> {
    return this.userModel.findById(id);
  }
  async getUsers(): Promise<User[]> {
    return this.userModel.find();
  }
  async login(loginDto: LoginDto) {
    const foundUser = await this.userModel.findOne({ email: loginDto.email });
    if (!foundUser) return null;
    const match = await bcrypt.compare(loginDto.password, foundUser.password);
    if (!match) return null;
    return foundUser;
  }
}
