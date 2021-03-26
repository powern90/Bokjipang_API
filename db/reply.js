const models = require("../models");

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