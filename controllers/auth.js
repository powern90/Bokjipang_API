const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config')
const authDB = require('../db/auth')
const admin = require('firebase-admin')
const category = require('../category')


exports.registerAPI = (req, res) => {
    const {phone, password} = req.body
    authDB.checkPassword({phone, password}).then(result =>
        res.status(200).json(
            {
                "ffdsa": result
            })
    );
}

exports.getAPI = (req, res) => {
    authDB.findAll()
        .then(all => res.status(200).json(
            {
                "all": all
            }
        ));
}

exports.phone_duplicateAPI = (req, res) => {
    const {phone} = req.body
    authDB.checkExist({phone})
        .then(result => {
            if (result) {
                res.status(200).json(
                    {
                        "exist": false
                    }
                )
            } else {
                res.status(200).json(
                    {
                        "exist": true
                    }
                )
            }
        })
}

exports.enrollAPI = (req, res) => {
    let {phone, password, name, gender, age, address, interest, fcmID} = req.body
    let topic = Object.fromEntries(Object.entries(category).map(entry => entry.reverse()))
    Object.keys(interest).forEach(subject => {
        if(interest[subject] === true) {
            admin.messaging().subscribeToTopic([fcmID], topic[subject])
                .then(function (response) {
                    console.log('Successfully subscribed to topic:', response);
                })
                .catch(function (error) {
                    console.log('Error subscribing to topic:', error);
                });
        }
    })
    interest = JSON.stringify(interest);
    password = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')
    authDB.enroll({phone, password, name, gender, age, address, interest, fcmID})
        .then(result => {
            if (result) {
                res.status(200).json(
                    {
                        "success": result
                    }
                )
            } else {
                res.status(403).json(
                    {
                        "success": result
                    }
                )
            }
        });
}

exports.loginAPI = (req, res) => {
    let {phone, password} = req.body
    password = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')
    const secret = req.app.get('jwt-secret')
    const check = (user) => {
        if (user === null) {
            throw new Error('login failed')
        } else {
            return new Promise((resolve, reject) => {
                jwt.sign(
                    {
                        phone: user.phone,
                        name: user.name,
                        uid: user.id,
                        interest: JSON.parse(user.interest),
                    },
                    secret,
                    {
                        expiresIn: '7d',
                        issuer: 'bluemango.site',
                        subject: 'Bokjipang',
                    }, (err, token) => {
                        if (err) reject(err)
                        resolve(token)
                    })
            })
        }
    }

    const respond = (token) => {
        res.status(200).json({
            message: 'logged in successfully',
            success: true,
            token
        })
    }

    const onError = (error) => {
        res.status(403).json({
            message: error.message,
            success: false
        })
    }

    authDB.checkPassword({phone, password})
        .then(check)
        .then(respond)
        .catch(onError)
}

exports.checkAPI = (req, res) => {
    res.json({
        success: true,
        info: req.decoded
    })
}

exports.changePWAPI = (req, res) => {
    const respond = () => {
        res.status(200).json({
            success: true
        })
    }

    const onError = (error) => {
        res.status(403).json({
            success: false,
            error
        })
    }

    let password = req.body.password;
    password = crypto.createHmac('sha1', config.secret)
        .update(password)
        .digest('base64')
    authDB.changePassword(password, req.decoded.uid)
        .then(respond)
        .catch(onError)
}
