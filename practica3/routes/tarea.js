var express = require('express'); 
const Tarea =require('../controllers/tarea');
const router = express.Router();

router.post('/', Tarea.create); 

router.get('/', Tarea.findAll);

router.get('/', Tarea.find);

router.put('/:tareaId', Tarea.update);

router.delete('/:tareaId', Tarea.detele);

module.exports = router; 