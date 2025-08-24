import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { buildSchema } from 'graphql';

import { AppDataSource } from './data-source';
import { User } from './entity/User';

const schema = buildSchema(`
  type User {
    id: Int
    name: String
    email: String
  }
  type Query {
    users: [User]
    user(id: Int, name: String, email: String): [User]
  }
type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: Int!, name: String, email: String): User
    deleteUser(id: Int!): User
  }
`);

export default schema;

export const root = {
  users: async () => {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.find();
  },
  user: async (args: { id?: number; name?: string; email?: string }) => {
    const userRepository = AppDataSource.getRepository(User);
    const queryBuilder = userRepository.createQueryBuilder("user");

    if (args.id) {
      queryBuilder.andWhere("user.id = :id", { id: args.id });
    }

    if (args.name) {
      queryBuilder.andWhere("user.name ILIKE :name", {
        name: `%${args.name}%`,
      });
    }

    if (args.email) {
      queryBuilder.andWhere("user.email ILIKE :email", {
        email: `%${args.email}%`,
      });
    }

    return await queryBuilder.getMany();
  },
  createUser: async ({ name, email }: { name: string; email: string }) => {
    const userRepository = AppDataSource.getRepository(User);

    const user = userRepository.create({ name, email });

    const errors = await validate(plainToInstance(User, user));
    if (errors.length > 0) {
      const msg = errors
        .map((e) => Object.values(e.constraints || {}).join(", "))
        .join("; ");
      console.log({
        errors: JSON.stringify(errors, null, 2),
        msg,
      });
      throw new Error(msg);
    }

    return await userRepository.save(user);
  },
  updateUser: async ({
    id,
    name,
    email,
  }: {
    id: number;
    name?: string;
    email?: string;
  }) => {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;

    const errors = await validate(plainToInstance(User, user));
    if (errors.length > 0) {
      throw new Error(
        errors
          .map((e) => Object.values(e.constraints || {}).join(", "))
          .join("; ")
      );
    }

    return await userRepository.save(user);
  },
  deleteUser: async ({ id }: { id: number }) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }
    return await userRepository.remove(user);
  },
};
