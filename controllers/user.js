const bcrypt = require("bcrypt")
const User = require("../models/user")
const image = require("../utils/image")

//Me devuelve los datos del usario que está logeado
async function getMe(req, res) {
    const { user_id } = req.user
    const response = await User.findById(user_id)
    console.log("response getMe", response)
    if(!response) {
        res.status(400).send({ msg: "No se ha encontrado usuario"})
    } else {
        res.status(200).send({ msg: "OK"})
    }
}

//Obtener todos los usuarios de mi BD si están activos o no 
async function getUsers(req, res) {
    try {
        const { active } = req.query;
        let response = null;

        if (active === undefined) {
            response = await User.find();
        } else {
            response = await User.find({ active });
        }

        // Verificar si se encontraron usuarios
        if (response.length === 0) {
            return res.status(404).send({ msg: "No se encontraron usuarios" });
        }

        // Enviar los datos de los usuarios en la respuesta
        res.status(200).send(response);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send({ msg: "Error al obtener usuarios" });
    }
}

//Crear usuario desde el panel del admin
async function createUser(req, res) {
    try {
        const { password } = req.body;
        const user = new User({ ...req.body, active: false });
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        user.password = hashedPassword;

        if (req.files.avatar) {
            const imagePath = image.getFilePath(req.files.avatar);
            user.avatar = imagePath;
        }

        const userStored = await user.save();
        res.status(201).send(userStored);
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(400).send({ msg: "Error al crear usuario", error });
    }
}

//Función para actrualizar el usuario
//TODO: Estudiar mejor esta función ya que al actualizar el user y mandar la funcion getMe no me actualiza local aunque pase cod 200
async function updateUser(req, res) {
    const { id } = req.params
    const userData = req.body
    console.log("userdata", userData)
    
    //Pass
    if(userData.password) {
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(userData.password, salt)
        userData.password = hashPassword
    } else {
        delete userData.password
    }
    //Avatar
    if(req.files.avatar) {
        const imagePath = image.getFilePath(req.files.avatar)
        userData.avatar = imagePath
    }

    User.findByIdAndUpdate({ _id: id }, userData, (error) => {
        if(error) {
            res.status(400).send({ msg: "Error al actualizar el usuario"})
        }else{
            res.status(200).send({ msg: "Actualización correcta"})
        }
    })
}

//Eliminar usuario
async function deleteUser(req, res) {
    const { id } = req.params
    User.findByIdAndDelete(id, (error) => {
        if(error) {
            res.status(400).send({ msg: "Error al eliminar usuario"})
        } else {
            res.status(200).send({ msg: "Usuario eliminado"})
        }
    })
}


module.exports = {
    getMe,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};