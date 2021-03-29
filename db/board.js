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

exports.getPost = async (id) => {
    return new Promise(resolve => {
        models.Board.findOne({
            attributes: ['id', 'title', 'content', 'category', 'like', 'createdAt'],
            where: {
                id: id
            }
        })
            .then(data => {
                resolve(data);
            })
            .catch(err => resolve(err))
    });
}

exports.updatePost = (post_id, title, content, uid) => {
    return new Promise((resolve, reject) => {
        models.Board.findOne({
            attributes: ['uid'],
            where: {
                id: post_id
            }
        })
            .then(data => {
                if (data.uid === uid) {
                    models.Board.update({
                        title: title,
                        content: content,
                        returning: true,
                    }, {
                        where: {
                            id: post_id
                        },
                    })
                        .then(data => resolve(data))
                        .catch(err => reject(err));
                }
                else {
                    reject("not my post")
                }
            })
    })
}

exports.addPost = (content, post_id, uid, m_id) => {
    return new Promise((resolve, reject) => {
        models.Reply.create({
            content: content,
            post_id: post_id,
            uid: uid,
            m_id: m_id,
            returning: true,
        })
            .then(data => {
                models.Reply.update({
                    m_id: data.id,
                    returning: true,
                }, {
                    where: {
                        id: data.id
                    },
                })
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    })
}