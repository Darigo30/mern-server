const Post = require("../models/post")
const image = require("../utils/image")

//Crear post
function createPost(req, res) {
    const post = new Post(req.body)
    post.created_at = new Date()

    const imagePath = image.getFilePath(req.files.miniature)
    post.miniature = imagePath

    post.save((error, postStored) => {
        if(error) {
            res.status(400).send({ msg: "Error al crear el post"})
        } else {
            res.status(201).send(postStored)
        }
    })
}

//Obtener post
function getAllPost(req, res) {
    const { page = 1, limit = 10 } = req.query

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { created_at: "desc" },
    }

    Post.paginate({}, options, (error, postStored) => {
        if(error) {
            res.status(400).send({msg: "Error al obtener los post"})
        } else {
            res.status(200).send(postStored)
        }
    })
}

//Actualizar post
function updatePost(req,res) {
    const { id } = req.params
    const postData = req.body

    if(req.files.miniature){
        const imagePath = image.getFilePath(req.files.miniature)
        postData.miniature = imagePath
    }

    Post.findByIdAndUpdate({ _id: id }, postData, (error) => {
        if(error) {
            res.status(400).send({ msg: "Error al actualizar el post"})
        } else {
            res.status(200).send({ msg: "Actualizacion correcta del post"})
        }
    })
}

//Eliminar post
function deletePost(req, res){
    const { id } = req.params

    Post.findByIdAndDelete(id, (error) => {
        if(error){
            res.status(400).send({ msg: "Error al eliminar el post"})
        } else{
            res.status(200).send({ msg: "Post eliminado"})
        }
    })
}

function getPost(req, res) {
    const { path } = req.params

    Post.findOne({ path }, (error, postStored) => {
        if (error) {
            res.status(500).send({ msg: "Error del server"})
        } else if (!postStored) { 
            res.status(400).send({ msg: "No se ha encontrado el post"})
        } else {
            res.status(200).send(postStored)
        }
   })
}

module.exports = {
    createPost,
    getAllPost,
    updatePost,
    deletePost,
    getPost,
}