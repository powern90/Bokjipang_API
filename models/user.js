module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'user',

        {
            phone: {
                type: DataTypes.STRING(11),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(5),
                allowNull: false,
            },
            gender: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
            },
            age: {
                type: DataTypes.INTEGER(11),
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT('tiny'),
                allowNull: false,
            },
            interest: {
                type: DataTypes.TEXT,
                allowNull: false,
            }
        },
        {
            timestamps: true,
        });
};
