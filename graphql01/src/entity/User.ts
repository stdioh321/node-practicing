import { IsEmail, Matches, MinLength } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @MinLength(3, { message: "Name must be at least 3 characters" })
  @Matches(/^[A-Z]/, { message: "Name must start with a capital letter" })
  name!: string;

  @Column()
  @IsEmail({}, { message: "Email must be valid" })
  email!: string;

  @OneToMany(() => Post, (post) => post.user, { nullable: true })
  posts!: Post[];
}
