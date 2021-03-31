const models = require("../models");

exports.getNew = () => {
    const getNew = () => {
        return new Promise((resolve, reject) => {
            models.Support.findAll({
                attributes: ['id', 'title', 'content', 'category', 'url', 'createdAt'],
                where: {
                    isSent: false
                },
                order: [['createdAt', 'ASC']]
            })
                .then(resolve)
                .catch(reject)
        })
    }

    const updateStatus = (data) => {
        return new Promise((resolve, reject) => {
            models.Support.update({
                isSent: true,
            }, {
                where: {
                    id: data.id
                }
            })
                .then(resolve)
                .catch(reject)
        })
    }

    const run = (data) => {
        return new Promise(async resolve => {
            const promises = data.map(updateStatus);
            await Promise.all(promises);
            resolve(data);
        })
    }

    return new Promise((resolve, reject) => {
        getNew()
            .then(run)
            .then(resolve)
            .catch(reject);
    })
}