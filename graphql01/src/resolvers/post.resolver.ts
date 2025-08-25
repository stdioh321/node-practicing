import { AppDataSource } from "../data-source";
import { Post } from "../entity/Post";
import { User } from "../entity/User";

export const postResolver = {
  Query: {
    posts: async () => {
      const postRepository = AppDataSource.getRepository(Post);
      return postRepository.find({ relations: ["user"] });
    },
    post: async (_: any, args: { id: number }) => {
      const postRepository = AppDataSource.getRepository(Post);
      return postRepository.findOne({
        where: { id: args.id },
        relations: ["user"],
      });
    },
  },

  Mutation: {
    createPost: async (
      _: any,
      args: {
        title: string;
        content: string;
        description?: string;
        id_lead: number;
      }
    ) => {
      const postRepository = AppDataSource.getRepository(Post);
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOneBy({ id: args.id_lead });
      if (!user) throw new Error("Usuário não encontrado");

      const post = postRepository.create({
        title: args.title,
        content: args.content,
        description: args.description,
        user,
      });

      return postRepository.save(post);
    },
  },
};
