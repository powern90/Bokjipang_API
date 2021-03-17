const models = require("../models");
const {Op} = require("sequelize");

exports.findAll = () => {
    return new Promise(resolve => {
        models.User.findAll()
            .then(data => resolve(data))
            .catch(err => resolve(err))
    });
}

exports.checkExist = (data) => {
    return new Promise(resolve => {
        models.User.count({ where: data})
            .then(count => {
                if (count !== 0) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
    });
}

exports.enroll = (data) => {
    return new Promise(resolve => {
       models.User.create(data)
           .then(resolve(true))
           .catch(err => {
                console.log(err);
                resolve(false);
           });
    });
}

exports.checkPassword = (data) => {
    return new Promise(resolve => {
        models.User.findOne({
            where: {[Op.and]: [{ phone: data.phone }, { password: data.password }]}
        })
            .then(data => {resolve(data)})
            .catch(err => resolve(err));
    });
}
