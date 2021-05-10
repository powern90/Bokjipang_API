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
                offset: parseInt(index),
                limit: 20,
                where: {
                    category: category[parseInt(support)]
                },
                order: [['id', 'DESC']]
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

exports.getZzim = (uid, limit) => {
    return new Promise(resolve => {
        models.Support.findAll({
            subQuery: false,
            attributes: ['id', 'title', 'content'],
            limit: (limit ? 3: 99999),
            include: [{
                model: models.User,
                where: {phone: uid},
                attributes: []
            }]
        })
            .then(data => resolve(data))
            .catch(err => resolve(err));
    });
}

const getUser = (phone) => {
    return new Promise((resolve, reject) => {
        models.User.findOne({
            where: {
                phone: phone
            }
        })
            .then(resolve)
            .catch(reject)
    })
}

const getSupport = (id) => {
    return new Promise((resolve, reject) => {
        models.Support.findOne({
            where: {
                id: id
            }
        })
            .then(resolve)
            .catch(reject)
    })
}

exports.addZzim = (phone, id) => {
    return new Promise(async resolve => {
        await Promise.all([getUser(phone), getSupport(id)])
            .then(datas => {
                datas[0].addSupport(datas[1])
                    .then(data => {
                        if(data === undefined) {
                            resolve(false);
                        }
                        resolve(true);
                    })
            })
    })
}

exports.removeZzim = (phone, id) => {
    return new Promise(async resolve => {
        await Promise.all([getUser(phone), getSupport(id)])
            .then(datas => {
                datas[0].removeSupport(datas[1])
                    .then(data => {
                        if(data === 0) {
                            resolve(false);
                        }
                        resolve(true);
                    });
            })
    })
}