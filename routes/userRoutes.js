const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser 
} = require('../controllers/userController');

// Routes utilisateur
router.get('/', getAllUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;