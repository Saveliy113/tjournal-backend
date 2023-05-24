import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { OutputBlockData } from '../dto/create-post.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  body: OutputBlockData[];

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  user: UserEntity;

  @Column()
  description: string;

  @Column({
    default: 0,
  })
  views: number;

  @Column({ nullable: true })
  tags?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
