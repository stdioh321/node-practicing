import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, MinLength, Matches } from "class-validator";

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
}
