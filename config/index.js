// Index.js is a special name so we don't need to give its path to import
// We can jst use import from config
import dotenv from 'dotenv';
dotenv.config(); // This gets all the keys defined inside .env file for us

export const {
    APP_PORT,
    DEBUG_MODE,
    DB_URL,
    JWT_SECRET
} = process.env;