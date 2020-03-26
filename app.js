const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Number {
            _id: ID!
            link: String!
            description: String!
            value: Float!
            date: String!
        }
        input NumberInput {
            link: String!
            description: String!
            value: Float!
            date: String!
        }
        type Collection {
            _id: ID!
            title: String!
            description: String
            numbers: [Number!]
            date: String!
        }
        type RootQuery {
            collections: [Collection!]!
        }
        type RootMutation {
            createNumber(numberInput: NumberInput): Number
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        collections: () => {
            return ['Prices of boots', 'Percentages', 'Data'];
        },
        createCollection: (args) => {
            const collectionName = args.name;
            return collectionName;
        }
    },
    graphiql: true
}))
app.get('/', (req, res, next) => {
    res.send('Hello World!');
})

//visits server
app.listen(3000);

