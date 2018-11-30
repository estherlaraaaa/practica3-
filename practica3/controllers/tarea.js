const mongoose= require('mongoose');
const tarea = require('../models/tarea');

exports.create = (req, res)=>{

    let tareaCreada = new tarea({
        tarea: req.body.tarea,
        descripcion: req.body.descripcion,
        propietario: req.body.propietario,
    });

    tareaCreada.save()
    .then(data =>{
        res.send({
            ok: true,
            message: 'tarea creada con exito',
            tarea: data,
        });
    })
    .catch(err =>{
        return res.status(500).send({
            ok:false,
            message: 'ups, ocurrio un error',
            error: err,
        });
    });
}

exports.findAll = (req, res) =>{
    tarea.find()
    .then(tareas =>{
        res.send({
            ok: true,
            message: 'tarea encontrada',
            tareas: tareas,
        });
    })
    .catch(err=>{
        return res.status(500).send({
            ok: false,
            message: 'no se encontro la tarea',
            error: err,
        });
    });
}

exports.find =(req, res)=>{
    tarea.findById(req.params.tareaId)
    .then(data=>{
        if (!data)
            return res.status(404).send({
                ok: false,
                message: 'No se ha encontrado la tarea',
            });
        
        res.send({
            ok: true,
            tareas: data,
        });
    })
    .catch(err=>{
        if (err.type =='ObjectId')
        return res.status(404).send({
            ok: false,
            message: 'no se ha encontrado la tarea con el id solicitado',
            error: err,
        });
    });
}

exports.update =(req,res) =>{
    tarea.findByIdAndUpdate(req.params.tareaId, {
        tarea: req.body.tarea,
        descripcion: req.body.descripcion,
        propietario: req.body.propietario,
    })
    .then(data=>{
        res.send({
            ok: true,
            tareaVieja: data,
        });
    })
    .catch(err=>{
        return res.status(500).send({
            ok:false,
            message: 'error al actualizar la clase',
            error: err,
        });
    })
}

exports.detele = (req, res) =>{
    tarea.findByIdAndDelete(req.params.tareaId)
    .then(data=>{
        res.send({
            ok:true,
            eliminada: data,
        });
    })
    .catch(err=>{
        return res.status(500).send({
            ok:false,
            message: 'error al eliminar',
            error: err,
        });
    })
}