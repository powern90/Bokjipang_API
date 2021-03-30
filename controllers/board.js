const boardDB = require('../db/board')
const replyDB = require('../db/reply')


exports.getBoardAPI = (req, res) => {
    const getCount = (post) => {
        return new Promise((resolve) => {
            replyDB.count(post.dataValues.id)
                .then(count => {
                    post.dataValues['reply_count'] = count;
                    resolve(post);
                })
        })
    }

    const getCounts = (posts) => {
        return new Promise(async (resolve) => {
            const promises = posts.map((post) => getCount(post));
            await Promise.all(promises);
            resolve(posts);
        })
    }

    const respond = (posts) => {
        res.status(200).json({
            posts: posts
        })
    }

    boardDB.getList(req.query.board, (req.query.page-1)*10+1, req.query.page*10)
        .then(getCounts)
        .then(respond)
}

exports.getPostAPI = async (req, res) => {
    const getPost = (post_id) => {
        return new Promise(resolve => {
            boardDB.getPost(post_id)
                .then(post => resolve(post));
        })
    }

    const getReply = (post_id) => {
        return new Promise(resolve => {
            replyDB.getReply(post_id, false)
                .then(getDoubleReply)
                .then(replies => resolve(replies));
                });
    }

    const getDoubleReply = (replies) => {
        const db_search = (reply) => {
            return new Promise(resolve => {
                replyDB.getReply(reply.id, true)
                    .then(double_replies => {
                        reply.dataValues['double_reply'] = double_replies;
                        resolve(double_replies);
                    });
            })
        }
        return new Promise(async resolve => {
            const promises = replies.map((reply) => db_search(reply));
            await Promise.all(promises);
            resolve(replies);
        })
    }

    res.status(200).json({
        post: await getPost(req.query.post),
        reply: await getReply(req.query.post)
    })
}

exports.updateReplyAPI = (req, res) => {
    replyDB.updateReply(req.body, req.decoded.uid)
        .then(() => {
            res.status(200).json({
                success: true
            })
        }).catch((err) => {
        res.status(404).json({
            success: false,
            err
        })
    })
}

exports.addReplyAPI = (req, res) => {
    replyDB.addReply(req.body, req.decoded.uid)
        .then(() => {
            res.status(200).json({
                success: true
            })
        }).catch((err) => {
        res.status(404).json({
            success: false,
            err
        })
    })
}

exports.deleteReplyAPI = (req, res) => {
    replyDB.deleteReply(req.body, req.decoded.uid)
        .then(() => {
            res.status(200).json({
                success: true
            })
        }).catch((err) => {
        res.status(404).json({
            success: false,
            err
        })
    })
}

exports.updatePostAPI = (req, res) => {
    boardDB.updatePost(req.body, req.decoded.uid)
        .then(() => {
            res.status(200).json({
                success: true
            })
        }).catch((err) => {
        res.status(404).json({
            success: false,
            message: err.message
        })
    })
}

exports.addPostAPI = (req, res) => {
    boardDB.addPost(req.body, req.decoded.uid)
        .then(() => {
            res.status(200).json({
                success: true
            })
        }).catch((err) => {
        res.status(404).json({
            success: false,
            err
        })
    })
}

exports.deletePostAPI = (req, res) => {
    boardDB.deletePost(req.body, req.decoded.uid)
        .then(() => {
            res.status(200).json({
                success: true
            })
        }).catch((err) => {
        res.status(404).json({
            success: false,
            err
        })
    })
}