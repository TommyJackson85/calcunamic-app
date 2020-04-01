const { buildSchema } = require('graphql');
module.exports = buildSchema(`
    type Collection {
        _id: ID!
        title: String!
        description: String!
        numbers: Float!
        date: String!
        creator: User!
    }
    type User {
        _id: ID!
        email: String!
        password: String
        createdCollections: [Collection!]
    }
    input CollectionInput {
        title: String!
        description: String!
        numbers: Float!
        date: String!
    }
    input UserInput {
        email: String!
        password: String!
    }
    type RootQuery {
        collections: [Collection!]!
    }
    type RootMutation {
        createCollection(collectionInput: CollectionInput): Collection
        createUser(userInput: UserInput): User
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)