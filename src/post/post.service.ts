import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { NotFoundException } from '@nestjs/common';
import { SearchPostDto } from './dto/search-post.dto';
import { AppDataSource } from 'src/data-source';

@Injectable()
export class PostService {
  private readonly postsRepository = AppDataSource.getRepository(PostEntity);

  create(dto: CreatePostDto, userId: number) {
    const firstParagraph = dto.body.find((obj) => obj.type === 'paragraph')
      ?.data?.text;

    return this.postsRepository.save({
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      user: { id: userId },
      description: firstParagraph || '',
    });
  }

  findAll() {
    return this.postsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async popular() {
    const qb = this.postsRepository.createQueryBuilder();

    qb.orderBy('views', 'DESC');
    qb.limit(10);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
    };
  }

  async search(dto: SearchPostDto) {
    const qb = this.postsRepository.createQueryBuilder('posts');

    qb.leftJoinAndSelect('posts.user', 'user');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.views) {
      qb.orderBy('views', dto.views);
    }

    if (dto.body) {
      qb.andWhere(`p.body ILIKE :body`);
    }

    if (dto.title) {
      qb.andWhere(`p.title ILIKE :title`);
    }

    if (dto.tag) {
      qb.andWhere(`p.tags ILIKE :tag`);
    }

    qb.setParameters({
      title: `%${dto.title}%`,
      body: `%${dto.body}%`,
      tag: `%${dto.tag}%`,
      views: dto.views || '',
    });

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  async findOne(id: number) {
    await this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.user', 'user')
      .update()
      .set({
        views: () => `views + 1`,
      })
      .execute();

    return this.postsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, dto: UpdatePostDto, userId: number) {
    const find = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }

    const firstParagraph = dto.body.find((obj) => obj.type === 'paragraph')
      ?.data.text;

    return this.postsRepository.update(id, {
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      user: { id: userId },
      description: firstParagraph || '',
    });
  }

  async remove(id: number, userId: number) {
    const find = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }

    if (find.user.id !== userId) {
      throw new ForbiddenException('Нет доступа к этой статье!');
    }

    return this.postsRepository.delete(id);
  }
}
