const pool = require('../config/db');

//Get all salles
const getAllSalles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM salle ORDER BY id_salle ASC');
        res.json(result.rows);
    }catch(error){
        res.status(500).json({message: 'Erreur server'});
    }
};

//GET by id
const getSalleById = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM salle WHERE id_salle= $1',
            [req.params.id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({message: 'Salle non trouvée'});
        }
        res.json(result.rows[0]);
    }catch (error){
        res.status(500).json({message: 'Erreur server'});
    }
}; 




module.exports = {
    getAllSalles,
    getSalleById,
   
}