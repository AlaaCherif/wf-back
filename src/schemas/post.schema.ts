import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsMongoId, IsNumber, IsDateString } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  poster_id: string;
  @Prop()
  status: boolean;
  @Prop()
  posted_at: Date;
  @Prop()
  closed_at: Date;
  @Prop()
  departs_at: Date;
  @Prop()
  start: string;
  @Prop()
  destination: string;
  @Prop()
  price: number;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', maxlength: 3 }],
  })
  applicants: User[];
  @Prop({ default: 3, max: 3 })
  place_count: number;
}

export class CreatePostDto {
  @IsMongoId()
  poster_id: string;
  @IsNotEmpty()
  @IsDateString()
  departs_at: Date;
  @IsNotEmpty()
  start: string;
  @IsNotEmpty()
  destination: string;
  @IsNumber()
  price: number;
  @IsNumber()
  place_count: number;
}
export class ApplyToPostDto {
  @IsMongoId()
  user_id: string;
  @IsMongoId()
  post_id: string;
}
export const PostSchema = SchemaFactory.createForClass(Post);
