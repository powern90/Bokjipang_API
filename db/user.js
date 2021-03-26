const models = require("../models");

exports.getZzim = (uid) => {
    console.log(uid);
    return new Promise(resolve => {
        models.Support.findAll({
            subQuery: false,
            attributes: ['id', 'title', 'content'],
            limit: 3,
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