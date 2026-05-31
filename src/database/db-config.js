import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

//Changing the database connection to use the DATABASE_URL from the .env file
//reason: will use render to do testing and render provides the DATABASE_URL for connecting to the database

export const sequelize = new Sequelize('postgresql://link_drop_db_user:X7k911ThYSYz3Ovsh2cBppmvAWEIG70J@dpg-d8e00lrbc2fs73c4ul7g-a/link_drop_db', {
    dialect: 'postgres',
    logging: false
})