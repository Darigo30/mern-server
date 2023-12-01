// Importa el módulo 'express'
const express = require("express")

// Importa el controlador de autenticación desde el archivo "../controllers/auth"
const AuthController = require("../controllers/auth")

// Crea una instancia del enrutador de express
const api = express.Router()

// Define una ruta POST en el enrutador para el registro de autenticación y la otra para el login
api.post("/auth/register", AuthController.register)
api.post("/auth/login", AuthController.login)

//Ruta para refrescar el accesToken

api.post("/auth/refresh_access_token", AuthController.refreshAccesToken)

// Exporta el enrutador 
module.exports = api