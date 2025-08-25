import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const userResolver = {
  Query: {
    users: async () => {
      const userRepository = AppDataSource.getRepository(User);
      return userRepository.find({ relations: ["posts"] });
    },
    user: async (
      _: any,
      args: { id?: number; name?: string; email?: string }
    ) => {
      const userRepository = AppDataSource.getRepository(User);
      let query = userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.posts", "post");

      if (args.id) query = query.andWhere("user.id = :id", { id: args.id });
      if (args.name)
        query = query.andWhere("user.name ILIKE :name", {
          name: `%${args.name}%`,
        });
      if (args.email)
        query = query.andWhere("user.email ILIKE :email", {
          email: `%${args.email}%`,
        });

      return query.getOne();
    },
  },

  Mutation: {
    createUser: async (_: any, args: { name: string; email: string }) => {
      const userRepository = AppDataSource.getRepository(User);

      if (!/^[A-Z].{2,}$/.test(args.name)) {
        throw new Error(
          "Nome deve iniciar com maiúscula e ter no mínimo 3 caracteres"
        );
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
        throw new Error("Email inválido");
      }

      const user = userRepository.create(args);
      return userRepository.save(user);
    },

    updateUser: async (
      _: any,
      args: { id: number; name?: string; email?: string }
    ) => {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: args.id });
      if (!user) throw new Error("Usuário não encontrado");

      if (args.name) {
        if (!/^[A-Z].{2,}$/.test(args.name)) {
          throw new Error(
            "Nome deve iniciar com maiúscula e ter no mínimo 3 caracteres"
          );
        }
        user.name = args.name;
      }

      if (args.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
          throw new Error("Email inválido");
        }
        user.email = args.email;
      }

      return userRepository.save(user);
    },
  },
};

export default userResolver;
