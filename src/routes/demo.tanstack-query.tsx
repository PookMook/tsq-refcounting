import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updatedDummyPeopleQuery } from "../queries/dummy-people";
import { useState } from "react";
import { person1Mutation } from "../mutations/person1";
import { queryClient } from "../integrations/tanstack-query/root-provider";

export const Route = createFileRoute("/demo/tanstack-query")({
  component: TanStackQueryDemo,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(updatedDummyPeopleQuery(1));
  },
});

function TanStackQueryDemo() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const test = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return await Promise.resolve({
        data: {
          __typename: "Person",
          age: 50,
          name: "Mutated Person",
          id: "1",
        },
      });
    },
  });

  return (
    <div className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-2xl mb-4 font-bold">People list</h1>
      <button onClick={() => test.mutate()}>Mutate</button> |
      <button onClick={() => setOpen(!open)}>Toggle</button> |
      <button onClick={() => setOpen2(!open2)}>Toggle2</button>
      {open && <TanStackQueryDemo2 iteration={1} />}
      {open2 && <TanStackQueryDemo2 iteration={2} />}
    </div>
  );
}

function TanStackQueryDemo2({ iteration }: { iteration: number }) {
  const { data } = useQuery(updatedDummyPeopleQuery(iteration));
  const test = useMutation(person1Mutation);
  return (
    <div>
      <h1>TanStackQueryDemo2</h1>
      <ul>{data?.map((person) => <li key={person.name}>{person.name}</li>)}</ul>
      <button onClick={() => test.mutate()}>Mutate</button>
    </div>
  );
}
