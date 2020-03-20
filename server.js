const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./src/schema/schema.js');

const app = express();
const projects = [];

app.use('/graphql', graphqlHTTP({
    schema:schema,
    rootValue: projects,
    context: projects,
    graphiql:true
}));

app.listen(4000, () => {
    console.log('Server is running on port 4000..');
});