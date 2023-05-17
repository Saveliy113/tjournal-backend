import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { AppDataSource as appDataSource } from 'src/data-source';

@Injectable()
export class CommentService {
  private readonly commentsRepository =
    appDataSource.getRepository(CommentEntity);

  create(dto: CreateCommentDto) {
    return this.commentsRepository.save({
      text: dto.text,
      post: {
        id: dto.postId,
      },
      user: { id: 11 },
    });
  }

  findAll() {
    return this.commentsRepository.find();
  }

  findOne(id: number) {
    return this.commentsRepository.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, dto: UpdateCommentDto) {
    return this.commentsRepository.update(id, dto);
  }

  remove(id: number) {
    return this.commentsRepository.delete(id);
  }
}
