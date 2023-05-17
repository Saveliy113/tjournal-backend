import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [UserModule, PostModule, CommentModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
