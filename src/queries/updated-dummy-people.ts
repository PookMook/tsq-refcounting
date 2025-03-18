import { queryOptions } from "@tanstack/react-query"

export const updatedDummyPeopleQuery = queryOptions({
    queryKey: ['people2'],
    queryFn: async () => { 
        await new Promise(resolve => setTimeout(resolve, 100))
        return (
      [{
        id: 1,
        __typename: 'Person',
        name: 'UpdatedJohn Doe',
        age: 30,
        email: 'john.doe@example.com',
      },
      {
        id: 2,
        __typename: 'Person',
        name: 'Updated Jane Doe',
        age: 25,
        email: 'jane.doe@example.com',
      }]
    )
  }
})