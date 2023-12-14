const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const expressMongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

const tourRouter = require('./routers/routeTour');
const userRouter = require('./routers/routeUser');
const reviewRouter = require('./routers/routeReview');

const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorController');

const app = express();

// for security HTTP headers
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});

app.use('/api', limiter);

app.use(compression());

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// for data sanitization against NoSQL query injection
app.use(expressMongoSanitize());
// for data sanitization against XSS
app.use(xss());
// for parameter pollution
app.use(hpp());

app.use(express.static('./public'));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError('This url is not correct ****from app.all *****', 404));
});

app.use(errorHandler);

module.exports = app;
