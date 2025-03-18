import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { dummyPeopleQuery } from '../queries/dummy-people'

export const Route = createFileRoute('/demo/tanstack-query')({
  component: TanStackQueryDemo,
  loader: async ({context}) => {
    context.queryClient.ensureQueryData(dummyPeopleQuery)
  }
})

function TanStackQueryDemo() {
  const { data } = useQuery(dummyPeopleQuery)

  const test = useMutation({
    mutationFn: () => {
      return Promise.resolve({
        data: {
          __typename: 'Person',
          age: 50,
          name: 'Mutated Person',
          id: '1'
        }
      })
    }
  })
  

  return (
    <div className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-2xl mb-4 font-bold">People list</h1>
      <ul className="space-y-2">
        {data?.map((person) => (
          <li key={person.name} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            {person.name}
          </li>
        ))}
      </ul>
      <button onClick={() => test.mutate()}>Mutate</button>
    </div>
  )
}
