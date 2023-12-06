const bcrypt = require("bcrypt")
const User = require("../models/user")
const image = require("../utils/image")

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
    res.status(200).send({msg: "Ok usuario Obtenido"})
}

//Crear usuario desde el panel del admin
async function createUser(req, res) {
    const { password } = req.body
    const user = new User({ ...req.body, active: false})
    const salt = bcrypt.genSaltSync(10)
    const hasPassword = bcrypt.hashSync(password, salt)
    user.password = hasPassword

    if(req.files.avatar) {
        const imagepath = image.getFilePath(req.files.avatar)
        user.avatar = imagepath
        console.log(user.avatar)
    }
    user.save((error, userStored) => {
        if(error) {
            res.status(400).send({ msg: "Error al crear user"})
        } else{
            res.status(201).send(userStored)
        }
    })
}

module.exports = {
    getMe,
    getUsers,
    createUser,
};