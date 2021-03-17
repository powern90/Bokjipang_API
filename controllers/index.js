exports.basicAPI = function  (req, res) {
    res.status(200).json(
        {
            "ffdsa": true
        }
    );
}

exports.postAPI = function  (req, res) {
    res.status(200).json(
        {
            "ffdsa": req.body.message
        }
    );
}
