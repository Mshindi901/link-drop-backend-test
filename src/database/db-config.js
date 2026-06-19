import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();
const db_url = process.env.DATABASE_URL

//Changing the database connection to use the DATABASE_URL from the .env file
//reason: will use render to do testing and render provides the DATABASE_URL for connecting to the database

export const sequelize = new Sequelize('postgresql://link_drop_db_user:X7k911ThYSYz3Ovsh2cBppmvAWEIG70J@dpg-d8e00lrbc2fs73c4ul7g-a.frankfurt-postgres.render.com/link_drop_db', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
})