// Controlador para la ruta POST "/auth/register"
function register (req, res) {
    res.status(200).send({ msg: "Todo OK"})
}

// Exporta el controlador como un objeto con la función "register"
module.exports = {
    register,
}