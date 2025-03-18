import { queryOptions } from "@tanstack/react-query"

export const updatedDummyPeopleQuery = (iteration: number) => queryOptions({
    queryKey: ['people', iteration],
    queryFn: async () => { 
        await new Promise(resolve => setTimeout(resolve, 1000))
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