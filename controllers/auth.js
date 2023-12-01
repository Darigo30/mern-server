const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("../utils/jwt")


// Controlador para la ruta POST "/auth/register"
function register (req, res) {

    const { firstname, lastname, email, password } = req.body 
    console.log(req.body)

    if(!email) res.status(400).send({ msg: "El email es obligatorio"})
    if(!password) res.status(400).send({ msg: "La contraseña es obligatoria"})

    const user = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        role: "user",
        active: false,
    })
    
    //Utilizo una dependencia de npm para encriptar la contraseña

    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(password, salt)
    user.password = hashPassword

    //Guardar usuario en BD Mongo 

    user.save((error, userStorage) => {
        if(error) {
            res.status(400).send({ msg: "Error al crear el usuario"})
        } else {
            res.status(200).send(userStorage)
        }
    })
}

//Función para loguearse 
function login(req, res) {
    
    const { email, password } = req.body

    if(!email) res.status(400).send({ msg: "El email es obligatorio"})
    if(!password) res.status(400).send({ msg: "La contraseña es obligatoria"})

    const emailLowerCase = email.toLowerCase()
    User.findOne( { email: emailLowerCase}, (error, userStorage) => {
        if(error) {
            res.status(500).send({ msg: "Error del servidor"})
        } else {
            bcrypt.compare(password, userStorage.password, (bcryptError, check) => {
                if(bcryptError) {
                    res.status(500).send({ msg: "Error del servidor"})
                } else if (!check) {
                    res.status(400).send({ msg: "Contraseña incorrecta"})
                } else if (!userStorage.active) {
                    res.status(401).send({ msg: "User no autorizado o no activo"})
                } else{ 
                    res.status(200).send({ 
                        acces: jwt.createAccesToken(userStorage),
                        refresh: jwt.createRefreshToken(userStorage),
                    })
                }
            })
        }
    }) 
}

function refreshAccesToken(req, res) {
    const { token } = req.body

    if (!token) res.status(400).send({msg: "Token requerido" })

    const { user_id } = jwt.decoded(token)

    console.log("user id", user_id)

    User.findOne({ _id: user_id }, (error, userStorage) => {
        if(error) {
            res.status(500).send({ msg: "Error del servidor"})
        } else {
            res.status(200).send({
                accesToken: jwt.createAccesToken(userStorage)
            })
        }
    })
}

// Exporta el controlador como un objeto con la función "register"
module.exports = {
    register,
    login,
    refreshAccesToken
}