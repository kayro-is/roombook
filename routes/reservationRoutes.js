const express = require('express');
const router = express.Router();
const {verifyToken } = require('../middleware/authMiddleware');


const {
    getAllReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation
} = require('../controllers/reservationController');

router.get('/', verifyToken, getAllReservations);
router.post('/', verifyToken, createReservation);
router.get('/:id', verifyToken, getReservationById);
router.put('/:id', verifyToken, updateReservation);
router.delete('/:id', verifyToken, deleteReservation);

module.exports = router;