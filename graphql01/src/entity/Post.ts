import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  id_lead!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "id_lead" })
  user!: User;
}
