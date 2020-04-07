const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
    '/graphql',
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    })
);

/*app.get('/', (req, res, next) => {
    res.send('Hello World!');
})*/

console.log(`PASSWORD: ${process.env.MONGO_PASSWORD}`);
mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${
            process.env.MONGO_PASSWORD
        }@cluster2-ygbmu.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
    )
    .then(() => {            
        //mongodb+srv://tommyJackson85:<password>@cluster2-ygbmu.mongodb.net/test?retryWrites=true&w=majority
        app.listen(3000);
    })
    .catch(err => {
        console.log(`PASSWORD: ${process.env.MONGO_PASSWORD}`);
        console.log(err);
    });
    //visits server

