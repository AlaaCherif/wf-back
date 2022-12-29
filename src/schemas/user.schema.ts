import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  gender: string;
  @Prop({ required: true })
  password: string;
  @Prop({ default: 0 })
  count: number;
  @Prop()
  created_at: Date;
  @Prop()
  updated_at: Date;
}

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @IsNotEmpty()
  gender: string;
}
export class LoginDto {
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
}

export class UpdateUserDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  name: string;
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', function (next) {
  let now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  next();
});
