import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { User, UserSchema } from './schemas/user.schema';
import { TokenService } from './user/token/token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'this is a secret key :o',
      signOptions: {
        expiresIn: '7d',
      },
    }),
    MongooseModule.forRoot(
      'mongodb+srv://alaa:doudoud2D@wf-project.fdiqpqb.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController, PostController, UserController],
  providers: [PostService, UserService, TokenService],
})
export class AppModule {}
