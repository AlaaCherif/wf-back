import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsDate,
  IsDateString,
} from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

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
}
export const PostSchema = SchemaFactory.createForClass(Post);
