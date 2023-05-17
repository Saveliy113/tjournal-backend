import { DataSource } from 'typeorm';
import { UserEntity } from './user/entities/user.entity';
import { PostEntity } from './post/entities/post.entity';
import { CommentEntity } from './comment/entities/comment.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'saveliy54321',
  database: 'tjournal',
  entities: [UserEntity, PostEntity, CommentEntity],
  synchronize: true,
});
