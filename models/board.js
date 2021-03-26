const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'board',
        {
            title: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            category: {
                type: Sequelize.STRING(5),
                allowNull: false,
            },
            uid: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            like: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            hit: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            timestamps: true,
        });
};
