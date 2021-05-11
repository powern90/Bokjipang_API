const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'user',
        {
            phone: {
                type: Sequelize.STRING(11),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(5),
                allowNull: false,
            },
            gender: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            interest: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            fcmID: {
                type: Sequelize.TEXT,
                allowNull: false,
                default: "temp"
            }
        },
        {
            timestamps: true,
        });
};
