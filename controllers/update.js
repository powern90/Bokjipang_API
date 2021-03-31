const supportDB = require('../db/support')
const admin = require('firebase-admin')
const category = require('../category')

exports.sendNotificationAPI = (res) => {
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
            const message = {
                notification: {
                    title: '새로운 지원사업이 등록되었습니다.',
                    body: noti.title
                },
                topic: String(topic[noti.category])
            }
            admin.messaging().send(message)
                .then(resolve)
                .catch(reject);
        });
    }

    const run = (notis) => {
        return new Promise(async resolve => {
            const promises = notis.map(sendMessage);
            await Promise.all(promises);
            resolve(notis);
        });
    }

    const respond = (posts) => {
        res.status(200).json({
            posts: posts
        })
    }

    const onError = (posts) => {
        res.status(403).json({
            error: posts
        })
    }

    getNew()
        .then(run)
        .then(respond)
        .catch(onError)
}