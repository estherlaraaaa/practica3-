const mongoose = require('mongoose');

var tareaModel = mongoose.Schema({
    tarea: String,
    descripcion: String,
    propietario: String
});

module.exports = mongoose.model('tarea', tareaModel); 



