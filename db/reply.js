const models = require("../models");
const sequelize = require("sequelize");
const {Op} = require("sequelize");
const userDB = require("./user");

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
        models.Reply.findAll({
            attributes: ['id', 'content', 'uid', 'createdAt'],
            where: {
                post_id: reply_id,
                id: double ? {[Op.ne]: sequelize.col('m_id')} : {[Op.eq]: sequelize.col('m_id')}
            },
            order: [[ 'createdAt', 'ASC' ]]
        }).then(async double_replies => {
            const promises = double_replies.map(getName);
            await Promise.all(promises);
            resolve(double_replies);
        });
    })
}


exports.updateReply = (reply_id, content, uid) => {
    return new Promise((resolve, reject) => {
        models.Reply.findOne({
            attributes: ['uid'],
            where: {
                id: reply_id
            }
        })
            .then(data => {
                if (data.uid === uid) {
                    models.Reply.update({
                        content: content,
                        returning: true,
                    }, {
                        where: {
                            id: reply_id
                        },
                    })
                        .then(data => resolve(data))
                        .catch(err => reject(err));
                }
                else {
                    reject("not my reply")
                }
            })
    })
}

exports.addReply = (content, post_id, uid, m_id) => {
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