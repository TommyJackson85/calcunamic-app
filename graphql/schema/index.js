const { buildSchema } = require('graphql');
module.exports = buildSchema(`
    type Number {
        _id: ID!
        value: Float!
        link: String!
        description: String!
        dataType: String!
        collectionIn: Collection!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }
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
    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }
    input NumberInput {
        value: Float!
        link: String!
        description: String!
        dataType: String!
        collectionID: ID!
    }
    input CollectionInput {
        title: String!
        description: String!
        numbers: Float!
        date: String!
    }
    input UserInput {
        password: String!
        email: String!
    }
    type RootQuery {
        collections(collectionsList: [ID!]!): [Collection!]!
        usersCollections(userId: ID!): [Collection!]!
        numbers: [Number!]!
        login(email: String!, password: String!): AuthData!
    }
    type RootMutation {
        createNumber(numberInput: NumberInput): Number
        deleteNumber(numberId: ID!): Collection
        createCollection(collectionInput: CollectionInput): Collection
        createUser(userInput: UserInput): User
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)