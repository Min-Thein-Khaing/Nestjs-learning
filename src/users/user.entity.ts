import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  firstName!: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  lastName?: string;

  @Column({
    type: 'varchar',
    length: 320,
    // Some existing rows have no email. The DTO still requires email for all
    // newly created users, while this keeps schema sync from rejecting old data.
    nullable: true,
    unique: true,
  })
  email!: string;

  @Exclude()
  @Column({
    type: 'varchar',
    // A bcrypt hash is currently 60 characters. Keep extra room so changing
    // the hashing cost/implementation does not break database inserts.
    length: 255,
    // Legacy rows may not have a password. CreateUserDto still requires one
    // for every newly created user.
    nullable: true,
  })
  password?: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  googleId?: string;

  @OneToMany(() => Post, (post) => post.author)
  posts?: Post[];
}
