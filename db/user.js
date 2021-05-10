const models = require("../models");

exports.getName = (uid) => {
    return new Promise(resolve => {
        models.User.findOne({
            attributes: ['name'],
            where: {
                id: uid
            }
        })
            .then(data => resolve(data))
            .catch(err => resolve(err));
    });
}

exports.updateUser = (data, uid) => {
    return new Promise((resolve, reject) => {
        models.User.update({
            address: data.address
        },{
            where: {
                id: uid
            }
        })
            .then(resolve)
            .catch(reject);
    });
}

exports.updateInterest = (data, uid) => {
    return new Promise((resolve, reject) => {
        models.User.update({
            interest: JSON.stringify(data.interest)
        },{
            where: {
                id: uid
            }
        })
            .then(resolve)
            .catch(reject)
    })
}