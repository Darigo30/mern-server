const User = require("../models/user")

//Me devuelve los datos del usario que está logeado

async function getMe(req, res) {
    const { user_id } = req.user
    const response = await  User.findById(user_id)
    console.log(response)
    if(!response) {
        res.status(400).send({ msg: "No se ha encontrado usuario"})
    } else {
        res.status(200).send({ msg: "OK"})
    }
}
//Obtener todos los usuarios de mi BD si están activos o no 

async function getUsers(req, res) {
    const { active } = req.query
    let response = null

    if(active === undefined) {
        response = await  User.find()
    } else {
        response = await User.find({ active })
    }

    console.log(response)
    res.status(200).send({msg: "Ok usuario Obtenido"})
}

module.exports = {
    getMe,
    getUsers,
}