const supportDB = require('../db/support')
const userDB = require('../db/user')


exports.getsupportAPI = (req, res) => {
    const respond = (posts) => {
        res.status(200).json({
            posts: posts
        })
    }
    supportDB.getList(req.query.support)
        .then(respond)
}
exports.addList = (req, res) => {
    const respond = (posts) => {
        res.status(200).json({
            posts: posts
        })
    }
    supportDB.more_getList(req.query.index, req.query.support)
        .then(respond)
}

exports.getPostAPI = (req, res) => {
    const respond = (post) => {
        res.status(200).json({
            post: post
        })
    }
    supportDB.getPost(req.query.index)
        .then(respond)
}
exports.searchPost = (req, res) => {
    const respond = (posts) => {
        res.status(200).json({
                posts: posts
        })
    }
    supportDB.searchPost(req.query.title, req.query.support)
        .then(respond)
}

exports.getZzimAPI = (req, res) => {
    supportDB.getZzim(req.decoded.phone, false)
        .then((data) => {
            res.status(200).json(
                {
                    zzim: data
                });
        });
}

exports.addZzimAPI = (req, res) => {
    supportDB.addZzim(req.decoded.phone, req.query.id)
        .then((data) => {
            res.status(200).json(
                {
                    success: data
                });
        });
}

exports.removeZzimAPI = (req, res) => {
    supportDB.removeZzim(req.decoded.phone, req.query.id)
        .then((data) => {
            res.status(200).json(
                {
                    success: data
                });
        });
}