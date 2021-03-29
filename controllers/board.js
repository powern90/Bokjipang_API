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
            return new Promise(resolve1 => {
                replyDB.getReply(reply.id, true)
                    .then(double_replies => {
                        reply.dataValues['double_reply'] = double_replies;
                        resolve1(double_replies);
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