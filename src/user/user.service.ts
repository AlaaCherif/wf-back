import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  LoginDto,
  UpdateUserDto,
  User,
  UserDocument,
} from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  //sign up
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
  //get user by email
  async getUser(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).select('-password');
  }
  //get user by id
  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id).select('-password');
  }
  //get all users
  async getUsers(): Promise<User[]> {
    return this.userModel.find().select('-password');
  }
  //login
  async login(loginDto: LoginDto) {
    const foundUser = await this.userModel.findOne({ email: loginDto.email });
    if (!foundUser) return null;
    const match = await bcrypt.compare(loginDto.password, foundUser.password);
    if (!match) return null;
    return foundUser;
  }
  //update user
  async updateUser(updateUserDto: UpdateUserDto) {
    const foundUser = await this.userModel.findOne({
      email: updateUserDto.email,
    });
    if (!foundUser) return null;
    if (foundUser.password && foundUser.password.length < 6) return null;
    foundUser.name = updateUserDto.name;
    foundUser.lastName = updateUserDto.lastName;
    if (updateUserDto.password) {
      const saltOrRounds = 10;
      foundUser.password = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds,
      );
    }
    return foundUser.save();
  }
}
