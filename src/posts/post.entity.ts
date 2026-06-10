import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PostStatus } from './enums/postStatus.enum';

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
  tag?: string[];
}
