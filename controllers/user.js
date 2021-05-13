const userDB = require('../db/user')
const admin = require('firebase-admin')
const category = require('../category')

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

exports.updateInterestAPI = async (req, res) => {
    const getToken = () => {
        return new Promise((resolve, reject) => {
            userDB.getFCMId(req.decoded.uid)
                .then(token => resolve(token.fcmID))
                .catch(reject)
        })
    }

    const getInterest = () => {
        return new Promise((resolve, reject) => {
            userDB.getInterest(req.decoded.uid)
                .then(resolve)
                .catch(reject)
        })
    }

    const Subscript = (token, interest) => {
        return new Promise((resolve, reject) => {
            let topic = Object.fromEntries(Object.entries(category).map(entry => entry.reverse()))
            Object.keys(interest).forEach(subject => {
                if(req.body.interest[subject] === true && interest[subject] === false) {
                    admin.messaging().subscribeToTopic([token], topic[subject])
                        .then(function(response) {
                            console.log('Successfully subscribed to topic:', response);
                        })
                        .catch(function(error) {
                            console.log('Error subscribing to topic:', error);
                            reject(error);
                        });
                }
                else if(req.body.interest[subject] === false && interest[subject] === true) {
                    admin.messaging().unsubscribeFromTopic([token], topic[subject])
                        .then(function(response) {
                            console.log('Successfully unsubscribed from topic:', response);
                        })
                        .catch(function(error) {
                            console.log('Error unsubscribing from topic:', error);
                            reject(error);
                        });
                }
            })
            resolve(true)
        })
    }

    const update = () => {
        userDB.updateInterest(req.body, req.decoded.uid)
            .then(() => {
                res.status(200).json({
                    success: true
                });
            })
            .catch(() => {
                res.status(403).json({
                    success: false
                });
            });
    }
    await Promise.all([getToken(), getInterest()])
        .then(values => {
            Subscript(values[0], values[1])
                .then(update)
        })
}

exports.fcmAPI = (req, res) => {
    userDB.updateFCMId(req.decoded.uid, req.body.token)
        .then(() => {
            res.json({
                success: true
            })
        })
        .catch(() => {
            res.json({
                success: false
            })
        })
}