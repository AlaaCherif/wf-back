import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Delete, Headers, Param } from '@nestjs/common/decorators';
import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { isMongoId } from 'class-validator';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostService } from 'src/post/post.service';
import { ApplyToPostDto, CreatePostDto } from 'src/schemas/post.schema';
import { User } from 'src/schemas/user.schema';
import { TokenService } from 'src/user/token/token.service';
import { UserService } from 'src/user/user.service';

@Controller('post')
export class PostController {
  constructor(
    private postService: PostService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {}
  @Get()
  //get posts
  async getPosts(@Res() response) {
    const posts = await this.postService.getPosts();
    return response.json(posts);
  }
  //get posts by id
  @Get('post/:id')
  async getPost(@Res() response, @Param('id') id: string) {
    if (!isMongoId(id)) throw new BadRequestException();
    const post = await this.postService.getPost(id);
    if (!post) throw new NotFoundException();
    return response.json(post);
  }
  @Get('user-posts/:id')
  async getUserPosts(@Res() res, @Param('id') id: string) {
    if (!isMongoId(id)) throw new BadRequestException();
    const user = await this.userService.getUserById(id);
    if (!user) throw new NotFoundException();
    const posts = await this.postService.getUserPosts(id);
    return res.json(posts);
  }
  @Post()
  //create a post
  @UseGuards(AuthGuard)
  async createPost(@Res() response, @Body() createPostDto: CreatePostDto) {
    const post = await this.postService.createPost(createPostDto);
    return response.json(post);
  }
  @Delete('/:id')
  //delete post
  //also checks if the user that made the delete request is the owner of the post
  @UseGuards(AuthGuard)
  async deletePost(
    @Res() response,
    @Param('id') id: string,
    @Headers('authorization') token: string,
  ) {
    const { email: tokenEmail } = this.tokenService.verifyToken(
      token.split(' ')[1],
    );
    const { poster_id } = await this.postService.getPost(id);
    const poster = await this.userService.getUserById(poster_id);
    if (poster.email !== tokenEmail) throw new ForbiddenException();
    if (!isMongoId(id)) throw new BadRequestException();
    const deletedDocument = await this.postService.deletePost(id);
    if (!deletedDocument) return new NotFoundException('post not found');
    else return response.json(deletedDocument);
  }
  @Post('/apply')
  @UseGuards(AuthGuard)
  async applyToPost(
    @Res() response,
    @Body() applyToPostDto: ApplyToPostDto,
    @Headers('authorization') token: string,
  ) {
    const tokenContent = this.tokenService.verifyToken(token.split(' ')[1]);
    const user: User = await this.userService.getUserById(
      applyToPostDto.user_id,
    );
    if (user.email !== tokenContent.email) throw new ForbiddenException();
    const application = await this.postService.applyToPost(
      applyToPostDto.post_id,
      user,
    );
    if (!application) throw new BadRequestException('post full');
    return response.json(application);
  }
  @Post('/unapply')
  @UseGuards(AuthGuard)
  async unapplyToPost(
    @Res() res,
    @Body() applyToPostDto: ApplyToPostDto,
    @Headers('authorization') token: string,
  ) {
    const tokenContent = this.tokenService.verifyToken(token.split(' ')[1]);
    const user: User = await this.userService.getUserById(
      applyToPostDto.user_id,
    );
    if (user.email !== tokenContent.email) throw new ForbiddenException();
    const result = await this.postService.unapplyToPost(
      applyToPostDto.post_id,
      applyToPostDto.user_id,
    );
    if (!result) throw new BadRequestException('not applied to post');
    return res.json(result);
  }
}
