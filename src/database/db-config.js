import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

//Changing the database connection to use the DATABASE_URL from the .env file
//reason: will use render to do testing and render provides the DATABASE_URL for connecting to the database

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false
})