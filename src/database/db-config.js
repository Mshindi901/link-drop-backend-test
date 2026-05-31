import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('linkdrop', 'postgres', 'Yugah5002@', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
})