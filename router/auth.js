// Importa el módulo 'express'
const express = require("express")

// Importa el controlador de autenticación desde el archivo "../controllers/auth"
const AuthController = require("../controllers/auth")

// Crea una instancia del enrutador de express
const api = express.Router()

// Define una ruta POST en el enrutador para el registro de autenticación
api.post("/auth/register", AuthController.register)

// Exporta el enrutador 
module.exports = api