const pool = require('../config/db');

// GET toutes les réservations avec JOIN

const getAllReservations = async (req, res) => {
    try {
        const { id_utilisateur, role } = req.user;

        let result;

        if (role === 'admin') {
            result = await pool.query(`
                SELECT 
                    r.id_reservation,
                    r.date_reservation,
                    r.heure_debut,
                    r.heure_fin,
                    r.statut,
                    u.nom,
                    u.prenom,
                    s.nom_salle
                FROM reservation r
                JOIN utilisateur u ON r.id_utilisateur = u.id_utilisateur
                JOIN salle s ON r.id_salle = s.id_salle
                ORDER BY r.id_reservation ASC
            `);
        } else {
            result = await pool.query(`
                SELECT 
                    r.id_reservation,
                    r.date_reservation,
                    r.heure_debut,
                    r.heure_fin,
                    r.statut,
                    u.nom,
                    u.prenom,
                    s.nom_salle
                FROM reservation r
                JOIN utilisateur u ON r.id_utilisateur = u.id_utilisateur
                JOIN salle s ON r.id_salle = s.id_salle
                WHERE r.id_utilisateur = $1
                ORDER BY r.id_reservation ASC
            `, [id_utilisateur]);
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// GET une réservation par ID
const getReservationById = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM reservation WHERE id_reservation = $1',
            [req.params.id_reservation]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la récupération de la réservation :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// POST une nouvelle réservation avec controle de chevauchement
const createReservation = async (req, res) => {
    const {
        date_reservation,
        heure_debut,
        heure_fin,
        statut,
        id_utilisateur,
        id_salle
    } = req.body;

    if (!date_reservation || !heure_debut || !heure_fin || !statut || !id_utilisateur || !id_salle) {
        return res.status(400).json({
            message: 'Tous les champs obligatoires doivent être remplis'
        });
    }

    if (heure_debut >= heure_fin) {
        return res.status(400).json({
            message: "L'heure de début doit être inférieure à l'heure de fin"
        });
    }

    try {
        const userCheck = await pool.query(
            'SELECT * FROM utilisateur WHERE id_utilisateur = $1',
            [id_utilisateur]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        const roomCheck = await pool.query(
            'SELECT * FROM salle WHERE id_salle = $1',
            [id_salle]
        );

        if (roomCheck.rows.length === 0) {
            return res.status(404).json({
                message: 'Salle non trouvée'
            });
        }

        const conflictCheck = await pool.query(
            `SELECT * FROM reservation
             WHERE id_salle = $1
             AND date_reservation = $2
             AND heure_debut < $3
             AND heure_fin > $4`,
            [id_salle, date_reservation, heure_fin, heure_debut]
        );

        if (conflictCheck.rows.length > 0) {
            return res.status(409).json({
                message: 'Cette salle est déjà réservée pour cette période'
            });
        }

        const result = await pool.query(
            `INSERT INTO reservation (
                date_reservation,
                heure_debut,
                heure_fin,
                statut,
                id_utilisateur,
                id_salle
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [date_reservation, heure_debut, heure_fin, statut, id_utilisateur, id_salle]
        );

        return res.status(201).json({
            message: 'Réservation créée avec succès',
            reservation: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        if (error.code === '23P01') {
            return res.status(409).json({
                message: 'Cette salle est déjà réservée pour ce créneau'
            });
        }

        return res.status(500).json({
            message: 'Erreur serveur'
        });
    }
};

// PUT une réservation
const updateReservation = async (req, res) => {
    const id = req.params.id_reservation;

    const {
        date_reservation,
        heure_debut,
        heure_fin,
        statut,
        id_utilisateur,
        id_salle
    } = req.body;

    if(!date_reservation || !heure_debut || !heure_fin || !statut || !id_utilisateur || !id_salle) {
        return res.status(400).json({ message: 'Tous les champs obligatoires doivent etre remplis'});
    }

    if (heure_debut >= heure_fin) {
        return res.status(400).json({ message : 'L\'heure de début doit être inférieure à l\'heure de fin' });
    }

    try {
        const reservationCheck = await pool.query(`
            SELECT * FROM reservation WHERE id_reservation = $1
        `, [id]);

        if (reservationCheck.rows.length === 0) {
            return res.status(404).json({message: 'Réservation non trouvée'});
        }

        const conflictCheck = await pool.query(`
            
            SELECT * FROM reservation
            WHERE id_salle = $1
            AND date_reservation = $2
            AND heure_debut < $3
            AND heure_fin > $4
            AND id_reservation != $5
        `, [id_salle, date_reservation, heure_fin, heure_debut, id]);

        if (conflictCheck.rows.length > 0) {
            return res.status(409).json({message : 'Cette salle est deja resrevée pour cette période' });
        }
 
        const result = await pool.query(
            `UPDATE reservation
             SET date_reservation = $1,
                 heure_debut = $2,
                 heure_fin = $3,
                 statut = $4,
                 id_utilisateur = $5,
                 id_salle = $6
             WHERE id_reservation = $7
             RETURNING *`,
            [
                date_reservation,
                heure_debut,
                heure_fin,
                statut,
                id_utilisateur,
                id_salle,
                id
            ]
        );

        res.json({
            message: 'Réservation modifiée avec succès',
            reservation: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
        
    

// DELETE une réservation
const deleteReservation = async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM reservation WHERE id_reservation = $1 RETURNING *',
            [req.params.id_reservation]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        res.json({ message: 'Réservation supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAllReservations,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation
};