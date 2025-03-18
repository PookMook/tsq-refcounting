import type { MutationOptions } from "@tanstack/react-query";

export const person1Mutation: MutationOptions = {
    mutationFn: async () => {

        await new Promise(resolve => setTimeout(resolve, 100))
      return await Promise.resolve({
        data: {
          __typename: "Person",
          age: 50,
          name: "Mutated Person",
          id: "1",
        },
      });
    },
  }