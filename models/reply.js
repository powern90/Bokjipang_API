const Sequelize = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define(
        'reply',
        {
            m_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            post_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            uid: {
                type: Sequelize.INTEGER,
                allowNull: false,
            }
        },
        {
            timestamps: true,
        });
};
