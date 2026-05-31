import {DataTypes} from 'sequelize';
import {sequelize} from '../database/db-config.js';

const File = sequelize.define('files', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    file_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    share_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file_password: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {timestamps: true});

export default File;