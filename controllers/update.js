const supportDB = require('../db/support')
const admin = require('firebase-admin')
const category = require('../category')

exports.sendNotificationAPI = (req, res) => {
    let topic = Object.fromEntries(Object.entries(category).map(entry => entry.reverse()))
    const getNew = () => {
        return new Promise((resolve, reject) => {
            supportDB.getNew()
                .then(resolve)
                .catch(reject);
        })
    }

    const sendMessage = (noti) => {
        return new Promise((resolve, reject) => {
            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            month = month >= 10 ? month : '0' + month
            let day = date.getDate()
            day = day >= 10 ? day : '0' + day
            let hour = date.getHours()
            hour = hour >= 10 ? hour : '0' + hour
            let min = date.getMinutes()
            let sec = date.getSeconds()
            sec = sec >= 10 ? sec : '0' + sec
            let purchaseDay = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
            const message = {
                notification: {
                    title: '새로운 '+ noti.category + ' 지원사업이 등록되었습니다.',
                    body: noti.title
                },
                topic: String(topic[noti.category]),
                data : {
                    id : String(noti.id),
                    createdAt: purchaseDay
                }
            }
            admin.messaging().send(message)
                .then(resolve)
                .catch(reject);
        });
    }

    const run = (notis) => {
        return new Promise(async (resolve, reject) => {
            const promises = notis.map(sendMessage);
            await Promise.all(promises)
                .then(resolve)
                .catch(reject)
        });
    }

    getNew()
        .then(run)
        .then(posts => {
            res.json({
                posts: posts
            })
        })
        .catch(posts => {
            res.json({
                error: posts
            })
        })
}

exports.insertNewAPI = (req, res) => {
    supportDB.createNew(req.body)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch(() => {
            res.status(403).json({
                success: false,
                err: err
            })
        })
}