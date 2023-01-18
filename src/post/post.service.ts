import { Injectable } from '@nestjs/common';
import { Post, PostDocument, CreatePostDto } from '../schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { BadRequestException } from '@nestjs/common/exceptions';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private userService: UserService,
  ) {}
  async getPosts(): Promise<Post[]> {
    return this.postModel.find();
  }
  async getPost(id: string) {
    return this.postModel.findById(id);
  }
  async getUserPosts(id: string) {
    return this.postModel.find({ poster_id: id });
  }
  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const poster = await this.userService.getUserById(createPostDto.poster_id);
    if (!poster) throw new BadRequestException();
    const createdCat = new this.postModel(createPostDto).save();
    return createdCat;
  }
  async deletePost(id: string): Promise<Post> {
    const deletedPost = await this.postModel.findByIdAndDelete(id);
    if (!deletedPost) return null;
    return deletedPost;
  }
  async applyToPost(post_id: string, user: User) {
    const post = await this.getPost(post_id);
    if (post.applicants.length > 2) return null;
    post.applicants.push(user);
    return post.save();
  }
  async unapplyToPost(post_id: string, user_id: string) {
    const post = await this.getPost(post_id);
    if (!post.applicants.length) return null;
    const exists = post.applicants.find(
      (value) => value.toString() === user_id,
    );
    if (!exists) return null;
    post.applicants = post.applicants.filter(
      (value) => value.toString() !== user_id,
    );
    return post.save();
  }
}
