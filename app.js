const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const Collection = require('./models/collection');

const app = express();

app.use(bodyParser.json());
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Collection {
            _id: ID!
            title: String!
            description: String!
            numbers: Float!
            date: String!
        }
        input CollectionInput {
            title: String!
            description: String!
            numbers: Float!
            date: String!
        }
        type RootQuery {
            collections: [Collection!]!
        }
        type RootMutation {
            createCollection(collectionInput: CollectionInput): Collection
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        collections: () => {
            return Collection.find()
                .then(collections => {
                    return collections.map(collection => {
                        return { ...collection._doc, id: collection.id }
                    });
                })
                .catch(err => {
                    throw err;
                })
        },
        createCollection: args => {
            const collection = new Collection({
                title: args.collectiontInput.title,
                description: args.collectionInput.description,
                numbers: args.collectionInput.numbers,
                date: new Date(args.collectionInput.date)
            });
           
            return collection
                .save()
                .then(result => {
                    console.log(result);
                    return { ...result._doc, id: result._doc._id.toString() };
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
            }
        },
        graphiql: true
    })
);
app.get('/', (req, res, next) => {
    res.send('Hello World!');
})

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${
            process.env.MONGO_PASSWORD
        }@cluster2-ygbmu.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    .then(() => {            
        //mongodb+srv://tommyJackson85:<password>@cluster2-ygbmu.mongodb.net/test?retryWrites=true&w=majority
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
    //visits server

