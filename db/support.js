const models = require("../models");
const {Op} = require("sequelize");
const category = require("../category");

exports.getList = (support) => {
    return new Promise(((resolve, reject) => {
        models.Support.findAll({
            attributes: ['id', 'title', 'content', 'createdAt'],
            limit: 20,
            where: {
                category: category[support],
            },
            order: [['createdAt', 'ASC']]
        })
            .then(resolve)
            .then(reject)
    }));
}
exports.more_getList = (index, support) => {
    return new Promise(((resolve, reject) => {
            models.Support.findAll({
                attributes: ['id', 'title', 'content', 'createdAt'],
                limit: 20,
                where: {
                    category: category[support],
                    id: {
                        [Op.gt] : index
                    }
                },
                order: [['createdAt', 'ASC']]
            })
                .then(resolve)
                .then(reject)
    }));
}
    exports.getPost = (id) => {
    return new Promise(((resolve, reject) => {
        models.Support.findOne({
            attributes: ['id', 'title', 'content', 'url', 'createdAt', 'updatedAt'],
            where: {
                id: id,
            },
        })
            .then(resolve)
            .then(reject)
    }));
}
    exports.searchPost = (title, support) => {
    return new Promise(((resolve, reject) => {
        models.Support.findAll({
            attributes: ['id', 'title', 'content', 'url', 'createdAt', 'updatedAt'],
            where: {
                title: {
                    [Op.like]: "%"+title+"%"
                },
                category: category[support]
            },
            order: [['createdAt','ASC']]
        })
            .then(resolve)
            .then(reject)
    }));
}


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

exports.createNew = (data) => {
    return new Promise((resolve, reject) => {
        models.Support.create({
            title: data.title,
            content: data.content,
            category: data.category,
            url: data.url
        })
            .then(resolve)
            .catch(reject);
    })
}