import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostStatus } from './enums/postStatus.enum';
import { Tag } from 'src/tags/tags.entity';
import { PostMeta } from 'src/post-meta/post-meta.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 256, nullable: false })
  title!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  slug!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  content!: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT })
  status!: PostStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  featureImgUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  publishedOn?: Date;

  @Column({
    type: 'text',
    array: true,
    nullable: true,
  })
  tag?: Tag[];

  @OneToOne(() => PostMeta, { cascade: true, eager: true })
  @JoinColumn()
  meta!: PostMeta;
}
