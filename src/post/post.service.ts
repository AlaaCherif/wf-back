import { Injectable } from '@nestjs/common';
import { Post, PostDocument, CreatePostDto } from '../schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private userService: UserService,
  ) {}
  async getPosts(): Promise<Post[]> {
    return this.postModel.find();
  }
  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const poster = await this.userService.getUser(createPostDto.poster_id);
    if (!poster) throw new BadRequestException();
    const createdCat = new this.postModel(createPostDto).save();
    return createdCat;
  }
}
