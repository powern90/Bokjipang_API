const moment = require("moment");
const models = require("../models");
const category = require("../category");
const {Op} = require("sequelize");

const checkUID = (post_id, uid) => {
    return new Promise((resolve, reject) => {
        models.Board.findOne({
            attributes: ['uid'],
            where: {
                id: post_id
            }
        })
            .then(fond_uid => {
                if(fond_uid.uid === uid) resolve(true);
                else resolve(false);
            })
            .catch(reject);
    })
}

exports.getBoardLatest = (board_name) => {
    return new Promise((resolve, reject) => {
        models.Board.findAll({
            attributes: ['id', 'title'],
            limit: 1,
            where: {
                category: board_name
            },
            order: [[ 'createdAt', 'DESC' ]]
        })
            .then(data => resolve(data[0]))
            .catch(reject)
    });
}

exports.getTopHit = () => {
    return new Promise((resolve, reject) => {
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
            .then(resolve)
            .catch(reject)
    });
}

exports.getList = async (board, start, end) => {
    return new Promise((resolve, reject) => {
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
            .then(resolve)
            .catch(reject)
    });
}

exports.getPost = async (id) => {
    return new Promise((resolve, reject) => {
        models.Board.findOne({
            attributes: ['id', 'title', 'content', 'category', 'like', 'createdAt'],
            where: {
                id: id
            }
        })
            .then(resolve)
            .catch(reject)
    });
}

exports.updatePost = (data, uid) => {
    const update = (data, valid) => {
        return new Promise((resolve, reject) => {
            if(valid) {
                models.Board.update({
                    title: data.title,
                    content: data.content,
                    returning: true,
                }, {
                    where: {
                        id: data.id
                    },
                })
                    .then(resolve)
                    .catch(reject);
            }
            else reject(new Error("Not My Post"));
        });
    }

    return new Promise((resolve, reject) => {
        checkUID(data.id, uid)
            .then(valid => update(data, valid))
            .then(resolve)
            .catch(reject);
    })
}

exports.addPost = (data, uid) => {
    const getCID = (category) => {
        return new Promise((resolve, reject) => {
            models.Board.findOne({
                attributes: ['cid'],
                where: {
                    category: category
                },
                order: [[ 'cid', 'DESC' ]]
            })
                .then(data => resolve(data.cid + 1))
                .catch(reject)
        })
    }

    const createPost = (data, cid, uid) => {
        return new Promise((resolve, reject) => {
            models.Board.create({
                title: data.title,
                content: data.content,
                category: data.category,
                cid: cid,
                uid: uid,
                returning: true
            })
                .then(resolve)
                .catch(reject)
        })
    }

    return new Promise((resolve, reject) => {
        getCID(data.category)
            .then(cid => createPost(data, cid, uid))
            .then(resolve)
            .catch(reject)
    })
}

exports.deletePost = (data, uid) => {
    const deletePost = (data, valid) => {
        return new Promise((resolve, reject) => {
            if(valid) {
                models.Board.destroy({
                    where: {
                        id: data.id
                    }
                })
                    .then(resolve)
                    .catch(reject);
            }
            else reject(new Error("Not My Post"));
        });
    }

    return new Promise((resolve, reject) => {
        checkUID(data.id, uid)
            .then(valid => deletePost(data, valid))
            .then(resolve)
            .catch(reject);
    })
}

exports.getMyPost = (uid) => {
    return new Promise((resolve, reject) => {
        models.Board.findAll({
            attributes: ['id', 'title', 'content', 'category', 'like', 'createdAt'],
            limit: 10,
            where: {
                uid: uid
            },
            order: [[ 'id', 'DESC' ]]
        })
            .then(resolve)
            .catch(reject)
    });
}