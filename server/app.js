console.log('Starting app.js');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const schema = require('./graphql/schemas/schema')
const root = require('./graphql/resolver/resolver');
const auth = require('./middleware/auth');


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// app.use(auth); 
  //caused issue with createAccount

// Routes
app.use('/api/users', userRoutes);

//app.get --> /navigate --> only check verifying token
app.use('/navigate', auth, (req, res) => {
  res.json({message: 'Successful match'})
});

app.use('/graphql',auth, graphqlHTTP((req) => ({
  schema: schema,
  rootValue: root,
  context: { user: req.user }, // Pass the req.user to the context
  graphiql: true, 
})));


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});



module.exports = app;

console.log('app.js setup complete');