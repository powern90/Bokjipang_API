const moment = require("moment");
const models = require("../models");
const {Op} = require("sequelize");
const supportDB = require("./support")

const category = {
    0: '장애인',
    1: '저소득',
    2: '다문화',
    3: '고령자',
    4: '한부모',
    5: '자유'
}

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
            limit: 20,
            where: {
                category: category[board],
                cid: {
                    [Op.gte]: start,
                    [Op.lte]: end,
                }
            },
            order: [[ 'cid', 'DESC' ]]
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
                .then(data => {
                    if(data === null) resolve(1)
                    resolve(data.cid + 1)
                })
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
            limit: 20,
            where: {
                uid: uid
            },
            order: [[ 'id', 'DESC' ]]
        })
            .then(resolve)
            .catch(reject)
    });
}

exports.getMyLike = async (phone, board, start, end) => {
    return new Promise((resolve, reject) => {
        models.Board.findAll({
            subQuery: false,
            attributes: ['id'],
            where: {
                category: category[board],
                cid: {
                    [Op.gte]: start,
                    [Op.lte]: end,
                }
            },
            include: [{
                model: models.User,
                attributes: [],
                where: {
                    phone: phone
                }
            }]
        })
            .then(data => {
                resolve(data.map(post => post.id));
            })
            .catch(err => {
                reject(err);
            });
    });
}

exports.addLike = (phone, id) => {
    return new Promise(async (resolve, reject) => {
        await Promise.all([supportDB.getUser(phone), this.getPost(id)])
            .then(datas => {
                datas[0].addBoard(datas[1])
                    .then(data => {
                        if(data === 0) {
                            reject(false);
                        }
                        models.Board.increment('like', {
                            by: 1,
                            where: {
                                id: id
                            }
                        })
                            .then(() => resolve(true))
                            .catch(() => reject(false))
                    })
                    .catch(reject)
            })
    })
}

exports.removeLike = (phone, id) => {
    return new Promise(async (resolve, reject) => {
        await Promise.all([supportDB.getUser(phone), this.getPost(id)])
            .then(datas => {
                datas[0].removeBoard(datas[1])
                    .then(data => {
                        if(data === 0) {
                            reject(false);
                        }
                        models.Board.decrement('like', {
                            by: 1,
                            where: {
                                id: id
                            }
                        })
                            .then(() => resolve(true))
                            .catch(() => reject(false))
                    })
                    .catch(reject)
            })
    })
}

exports.isLike = async (phone, id) => {
    return new Promise((resolve, reject) => {
        models.Board.count({
            subQuery: false,
            where: {
                id: id
            },
            include: [{
                model: models.User,
                attributes: [],
                where: {
                    phone: phone
                }
            }]
        })
            .then(count => {
                resolve(count !== 0);
            })
            .catch(err => {
                reject(err);
            });
    });
}

