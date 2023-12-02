async function getMe(req, res) {
    res.status(200).send({ msg: "OK"})
}

module.exports = {
    getMe,
}