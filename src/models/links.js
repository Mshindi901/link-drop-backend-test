import { DataTypes } from "sequelize";
import {sequelize} from '../database/db-config.js';

const Link = sequelize.define('links', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    file_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'files',
            key: 'id'
        }
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_protected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
}, {timestamps:true});

export default Link;