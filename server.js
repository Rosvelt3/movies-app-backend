const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const port = process.env.PORT || 5000;

require('dotenv').config({path: './config/config.env'});
connectDB();

const movies = require('./routes/movies');
const auth = require('./routes/auth');
const users = require('./routes/users');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/movies', movies);
app.use('/api/v1/auth', auth);
app.use('/api/v1/courses', users);
app.use(errorHandler);

const server = app.listen(port, ()=>{
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
})