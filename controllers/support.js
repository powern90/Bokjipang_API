const supportDB = require('../db/support')


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