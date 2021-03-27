const moment = require("moment");
const models = require("../models");
const category = require("../category");
const {Op} = require("sequelize");

exports.getBoardLatest = (board_name) => {
    return new Promise(resolve => {
        models.Board.findAll({
            attributes: ['id', 'title'],
            limit: 1,
            where: {
                category: board_name
            },
            order: [[ 'createdAt', 'DESC' ]]
        })
            .then(data => resolve(data[0]))
            .catch(err => resolve(err))
    });
}

exports.getTopHit = () => {
    return new Promise(resolve => {
        models.Board.findAll({
            attributes: ['id', 'title', 'content', 'category', 'like'],
            limit: 3,
            where: {
                createdAt: {
                    [Op.gte]: moment().subtract(7, 'days').toDate()
                }
            },
            order: [[ 'hit', 'DESC' ]]
        })
            .then(data => resolve(data))
            .catch(err => resolve(err))
    });
}

exports.getList = async (board, start, end) => {
    return new Promise(resolve => {
        models.Board.findAll({
            attributes: ['id', 'title', 'content', 'category', 'like', 'createdAt'],
            limit: 10,
            where: {
                category: category[board],
                cid: {
                    [Op.gte]: start,
                    [Op.lte]: end,
                }
            },
            order: [[ 'cid', 'ASC' ]]
        })
            .then(data => {
                resolve(data);
            })
            .catch(err => resolve(err))
    });
}