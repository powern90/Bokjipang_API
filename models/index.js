const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Board = require('./board')(sequelize, Sequelize);
db.Reply = require('./reply')(sequelize, Sequelize);
db.Support = require('./support')(sequelize, Sequelize);

// user와 board 1:N
db.User.hasMany(db.Reply, {foreignKey:'uid', sourceKey:'id'});
db.Board.belongsTo(db.User,{foreignKey:'uid',targetKey:'id'});

// user와 comment 1:N
db.User.hasMany(db.Reply, {foreignKey:'uid', sourceKey:'id'});
db.Reply.belongsTo(db.User,{foreignKey:'uid',targetKey:'id'});

// user와 support M:N
db.User.belongsToMany(db.Support, {through: 'zzim', foreignKey: 'phone', sourceKey: 'phone'});
db.Support.belongsToMany(db.User,{through: 'zzim'});

// board와 comment 1:N
db.Board.hasMany(db.Reply, {foreignKey:'post_id', sourceKey:'id'});
db.Reply.belongsTo(db.User,{foreignKey:'post_id',targetKey:'id'});

module.exports = db;
