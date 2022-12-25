import { Controller, Get, Post } from '@nestjs/common';

@Controller('post')
export class PostController {
  @Get()
  getPosts(): string {
    return 'yes you don';
  }
  @Post()
  createPost(): string {
    return 'created post';
  }
}
