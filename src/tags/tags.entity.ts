import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'varchar',
    length: 250,
    nullable: false,
    unique: true,
  })
  label!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;
}
