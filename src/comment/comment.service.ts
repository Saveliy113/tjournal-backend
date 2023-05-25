import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { AppDataSource as appDataSource } from 'src/data-source';
import { UserEntity } from 'src/user/entities/user.entity';
import { User } from 'src/decorators/user.decorator';

@Injectable()
export class CommentService {
  private readonly commentsRepository =
    appDataSource.getRepository(CommentEntity);

  async create(dto: CreateCommentDto, userId: number) {
    const comment = await this.commentsRepository.save({
      text: dto.text,
      post: {
        id: dto.postId,
      },
      user: { id: userId },
    });

    return this.commentsRepository.findOne({
      where: {
        id: comment.id,
      },
      relations: ['user'],
    });
  }

  async findAll(postId: number) {
    const qb = this.commentsRepository.createQueryBuilder('c');

    if (postId) {
      qb.where('c.postId = :postId', { postId });
    }

    const arr = await qb
      .leftJoinAndSelect('c.post', 'post')
      .leftJoinAndSelect('c.user', 'user')
      .getMany();

    return arr.map((obj) => {
      return {
        ...obj,
        post: {
          id: obj.post.id,
        },
      };
    });
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
