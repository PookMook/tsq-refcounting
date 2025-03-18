import { queryOptions } from "@tanstack/react-query"

export const dummyPeopleQuery = queryOptions({
    queryKey: ['people'],
    queryFn: async () => { 
        await new Promise(resolve => setTimeout(resolve, 100))
        return (
      [{
        id: 1,
        __typename: 'Person',
        name: 'John Doe',
        age: 30,
        email: 'john.doe@example.com',
      },
      {
        id: 2,
        __typename: 'Person',
        name: 'Jane Doe',
        age: 25,
        email: 'jane.doe@example.com',
      }]
    )
  }
})