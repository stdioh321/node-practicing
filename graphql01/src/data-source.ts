import "reflect-metadata";

import dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Post } from "./entity/Post";
import { User } from "./entity/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Post],
  synchronize: true,
});
