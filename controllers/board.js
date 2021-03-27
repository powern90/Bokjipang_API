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