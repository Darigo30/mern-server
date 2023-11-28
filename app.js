// Importamos express, lo invocamos y lo exportamos para crear la petición http
const express = require("express")
const bodyParser = require("body-parser")
const { API_VERSION } = require("./constants")
const cors = require("cors")
const app = express()

//  Configurar body parser
app.use(bodyParser.urlencoded({ exgtend: true }))
app.use(bodyParser.json())

//Configurar stactic folder
app.use(express.static("uploads"))

//Configurar CORS
app.use(cors())

module.exports = app