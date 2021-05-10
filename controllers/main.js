const boardDB = require('../db/board')
const supportDB = require('../db/support')


exports.getBoardAPI = async (req, res) => {
    res.status(200).json(
        {
            0: await boardDB.getBoardLatest("장애인"),
            1: await boardDB.getBoardLatest("저소득"),
            2: await boardDB.getBoardLatest("다문화"),
            3: await boardDB.getBoardLatest("고령자"),
            4: await boardDB.getBoardLatest("한부모"),
            5: await boardDB.getBoardLatest("자유")
        });
}

exports.getHighAPI = (req, res) => {
    boardDB.getTopHit()
        .then(posts => {
            res.status(200).json(
                {
                    high: posts
                });
        });
}

exports.getMainAPI = async (req, res) => {
    res.status(200).json(
        {
            board: {
                0: await boardDB.getBoardLatest("장애인"),
                1: await boardDB.getBoardLatest("저소득"),
                2: await boardDB.getBoardLatest("다문화"),
                3: await boardDB.getBoardLatest("고령자"),
                4: await boardDB.getBoardLatest("한부모"),
                5: await boardDB.getBoardLatest("자유")
            },
            zzim: await supportDB.getZzim(req.decoded.phone, true),
            high: await boardDB.getTopHit()
        });
}