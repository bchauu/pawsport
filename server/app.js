console.log('Starting app.js');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const schema = require('./graphql/schemas/schema')
const resolver = require('./graphql/resolver/resolver');
const auth = require('./middleware/auth');
const searchRoutes = require('./routes/searchRoutes');

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
  rootValue: resolver,
  context: { user: req.user }, // Pass the req.user to the context
  graphiql: true, 
})));

app.use('/location', auth, searchRoutes, (req, res) => {
  res.json({message: 'successfully retrieved coordinates'});
})


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});



module.exports = app;

console.log('app.js setup complete');