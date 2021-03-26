const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'support',
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
                type: Sequelize.STRING,
                allowNull: false,
            },
            url: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        },
        {
            timestamps: true,
        });
};
