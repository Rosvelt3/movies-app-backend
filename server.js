const express = require('express');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const port = process.env.PORT || 5000;

require('dotenv').config({ path: './config/config.env' });
connectDB();

const movies = require('./routes/movies');
const auth = require('./routes/auth');
const users = require('./routes/users');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(rateLimit({ windowMs: 10 * 60 * 1000, max: 10000 }));
app.use(hpp());

const whitelist = ["http://localhost:3000", "https://movies-app-backend.herokuapp.com"];
app.use(cors({
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by cors"));
    }
  }
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/movies', movies);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
})