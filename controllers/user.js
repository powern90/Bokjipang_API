const userDB = require('../db/user')

exports.updateUserAPI = (req, res) => {
    userDB.updateUser(req.body, req.decoded.uid)
        .then(() => {
            res.status(200).json({
                success: true
            });
        })
        .catch((err => {
            res.status(403).json({
                success: false,
                err
            });
        }));
}

exports.updateInterestAPI = (req, res) => {
    userDB.updateInterest(req.body, req.decoded.uid)
        .then(() => {
            res.status(200).json({
                success: true
            });
        })
        .catch((err => {
            res.status(403).json({
                success: false,
                err
            });
        }));
}