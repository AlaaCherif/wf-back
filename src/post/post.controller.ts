import { Controller, Get, Post, Res, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostService } from 'src/post/post.service';
import { CreatePostDto } from 'src/schemas/post.schema';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}
  @Get()
  async getPosts(@Res() response) {
    const posts = await this.postService.getPosts();
    return response.json(posts);
  }
  @Post()
  @UseGuards(AuthGuard)
  async createPost(@Res() response, @Body() createPostDto: CreatePostDto) {
    const post = await this.postService.createPost(createPostDto);
    return response.json(post);
  }
}
