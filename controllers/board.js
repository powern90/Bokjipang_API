const boardDB = require('../db/board')
const replyDB = require('../db/reply')

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


exports.getBoardAPI = (req, res) => {
    const getLike = (post) => {
        return new Promise((resolve) => {
            boardDB.getMyLike(req.decoded.phone, req.query.board, (req.query.page-1)*20+1, req.query.page*20)
                .then(likePosts => {
                    post.forEach(async post => {
                        await likePosts.includes(post.id) ? post.dataValues['my_like'] = 1: post.dataValues['my_like'] = 0
                    })
                    resolve(post);
                })
        })
    }

    const respond = (posts) => {
        res.status(200).json({
            posts: posts
        })
    }

    boardDB.getList(req.query.board, (req.query.page-1)*20+1, req.query.page*20)
        .then(getCounts)
        .then(getLike)
        .then(respond)
}

exports.getPostAPI = async (req, res) => {
    const getPost = (post_id) => {
        return new Promise(async resolve => {
            await Promise.all([boardDB.getPost(post_id), boardDB.isLike(req.decoded.phone, post_id)])
                .then(datas => {
                    datas[1] ? datas[0].dataValues['my_like'] = 1: datas[0].dataValues['my_like'] = 0
                    resolve(datas[0])
                });
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
                replyDB.getReply(reply, true)
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
    console.log(req.body)
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

exports.getMyPostAPI = (req, res) => {
    const respond = (posts) => {
        res.status(200).json({
            posts: posts
        })
    }

    boardDB.getMyPost(req.decoded.uid)
        .then(getCounts)
        .then(respond)
}

exports.addLikeAPI = (req, res) => {
    boardDB.addLike(req.decoded.phone, req.query.id)
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

exports.deleteLikeAPI = (req, res) => {
    boardDB.removeLike(req.decoded.phone, req.query.id)
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