function getFilePath(file) {
    const filePath = file.path
    return filePath
    
    //TODO: Por alguna razón esta cuestion me está llegando undefined, avanzaré con esto luego
    //const fileSplit = filePath.split("/")
    //return `${fileSplit[1]}/${fileSplit[2]}`

}

module.exports = {
    getFilePath,
}