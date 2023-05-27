import express from 'express';
import { APP_PORT, DB_URL } from './config';
import routes from './routes';
import errorHandler from './middlewares/errorHandler';
import mongoose from 'mongoose';
import path from 'path';

const app = express()

// Mongoose Database Connection
// const url = 'mongodb://localhost/pizza';
// Pass url and mongodb config
mongoose.connect(DB_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify : true});
// Store connection in a var to use it later
const db = mongoose.connection;
// Check if db is on
db.on('error', console.error.bind(console, 'connection error:'));
// Event listener for open type, if DB connected then event is called which basically logs DB conn else if err..
db.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});

// Global vars
global.appRoot = path.resolve(__dirname);

app.use(express.urlencoded({ extended: false }));

// By default in express, json data is disabled that its receives
// We need to enable it using express' inbuilt middleware
app.use(express.json());

// Register our routes on the server
// Prefix '/api' before all routes
app.use('/api', routes);

// Always register for middlewares.
// Do it in the last after everything is setup
app.use(errorHandler);

app.listen(APP_PORT, () => {
    console.log(`Listening on port ${APP_PORT}`);
});