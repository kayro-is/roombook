const express = require('express');
const router = express.Router();

const {
    getAllSalles,
    getSalleById,

} = require('../controllers/salleController');

router.get('/', getAllSalles);
router.get('/:id', getSalleById);


module.exports = router;