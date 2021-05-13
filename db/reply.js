const models = require("../models");
const sequelize = require("sequelize");
const {Op} = require("sequelize");
const userDB = require("./user");

const getName = (reply) => {
    return new Promise((resolve, reject) => {
        userDB.getName(reply.uid)
            .then(result => {
                reply.dataValues['uid'] = result.name;
                resolve(reply);
            })
            .catch(err => reject(err));
    })
}

const checkUID = (data, uid) => {
    return new Promise((resolve, reject) => {
        models.Reply.findOne({
            attributes: ['uid'],
            where: {
                id: data.id
            }
        })
            .then(found_uid => {
                if(found_uid.uid === uid) resolve(true);
                else (resolve(false));
            })
            .catch(reject);
    })
}

exports.count = (post_id) => {
    return new Promise(resolve => {
        models.Reply.count({
            where: {
                post_id: post_id
            }
        })
            .then(count => resolve(count));
    });
}

exports.getReply = (reply_id, double) => {
    return new Promise(resolve => {
        models.Reply.findAll(double ?
            {
                attributes: ['id', 'content', 'uid', 'createdAt'],
                where: {
                    post_id: reply_id.post_id,
                    m_id: reply_id.id,
                    id: {[Op.ne]: sequelize.col('m_id')}
                },
                order: [[ 'createdAt', 'ASC' ]]
            } :
            {
            attributes: ['id', 'content', 'uid', 'post_id', 'createdAt'],
            where: {
                post_id: reply_id,
                id: {[Op.eq]: sequelize.col('m_id')}
            },
            order: [[ 'createdAt', 'ASC' ]]
            }
        ).then(async double_replies => {
            const promises = double_replies.map(getName);
            await Promise.all(promises);
            resolve(double_replies);
        });
    })
}


exports.updateReply = (data, uid) => {
    const update = (data, valid) => {
        return new Promise((resolve, reject) => {
            if (valid) {
                models.Reply.update({
                    content: data.content,
                }, {
                    where: {
                        id: data.id
                    },
                })
                    .then(resolve)
                    .catch(reject);
            }
            else {
                reject(new Error("Not my reply"))
            }
        })
    }

    return new Promise((resolve, reject) => {
        checkUID(data, uid)
            .then(valid => update(data, valid))
            .then(resolve)
            .catch(reject);
    });
}

exports.addReply = (data, uid) => {
    const createReply = (data, uid) => {
        return new Promise((resolve, reject) => {
            models.Reply.create({
                content: data.content,
                post_id: data.post_id,
                uid: uid,
                m_id: data.m_id,
                returning: true,
            })
                .then(resolve)
                .catch(reject)
        })
    }

    const setMID = (data) => {
        return new Promise((resolve, reject) => {
            if(data.m_id === 0) {
                models.Reply.update({
                    m_id: data.id,
                    returning: true,
                }, {
                    where: {
                        id: data.id
                    },
                })
                    .then(resolve)
                    .catch(reject);
            }
            else resolve(data);
        })
    }

    return new Promise((resolve, reject) => {
        createReply(data, uid)
            .then(setMID)
            .then(resolve)
            .catch(reject)
    })
}

exports.deleteReply = (data, uid) => {
    const deleteReply = (data, valid) => {
        return new Promise((resolve, reject) => {
            if (valid) {
                models.Reply.destroy({
                    where: {
                        id: data.id
                    },
                })
                    .then(resolve)
                    .catch(reject);
            }
            else {
                reject(new Error("Not my reply"))
            }
        })
    }

    return new Promise((resolve, reject) => {
        checkUID(data, uid)
            .then(valid => deleteReply(data, valid))
            .then(resolve)
            .catch(reject);
    });
}