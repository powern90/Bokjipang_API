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

const getName = (reply) => {
    return new Promise(resolve => {
        userDB.getName(reply.uid)
            .then(result => {
                reply.dataValues['uid'] = result.name;
                resolve(reply);
            });
    })
}