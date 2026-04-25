const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// GET all users
const getAllUsers = async (req, res) => {
  console.log("GET ALL USERS CORRIGÉ UTILISÉ");
  try {
    const result = await pool.query(
      `SELECT id_utilisateur, nom, prenom, email, role
       FROM utilisateur
       ORDER BY id_utilisateur ASC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Erreur getAllUsers :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET user by id
const getUserById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id_utilisateur, nom, prenom, email, role
       FROM utilisateur
       WHERE id_utilisateur = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur getUserById :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// POST create user
const createUser = async (req, res) => {
  let { nom, prenom, email, mot_de_passe } = req.body;

  nom = nom?.trim();
  prenom = prenom?.trim();
  email = email?.trim().toLowerCase();

  const role = "user";

  if (!nom || !prenom || !email || !mot_de_passe) {
    return res.status(400).json({
      message: "Nom, prénom, email et mot de passe sont obligatoires",
    });
  }

  try {
    const existingUser = await pool.query(
      "SELECT id_utilisateur FROM utilisateur WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Cet email est déjà utilisé",
      });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const result = await pool.query(
      `INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_utilisateur, nom, prenom, email, role`,
      [nom, prenom, email, hashedPassword, role]
    );

    return res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Erreur createUser :", error);
    return res.status(500).json({
      message: "Erreur serveur",
    });
  }
};

// PUT update user
const updateUser = async (req, res) => {
  const id = req.params.id;
  let { nom, prenom, email, mot_de_passe, role } = req.body;

  nom = nom?.trim();
  prenom = prenom?.trim();
  email = email?.trim().toLowerCase();
  role = role?.trim();

  try {
   const existingUser = await pool.query(
  `SELECT id_utilisateur, nom, prenom, email, mot_de_passe, role
   FROM utilisateur
   WHERE id_utilisateur = $1`,
  [id]
);

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const currentUser = existingUser.rows[0];

    let hashedPassword = currentUser.mot_de_passe;

    if (mot_de_passe && mot_de_passe.trim() !== "") {
      hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    }

    const result = await pool.query(
      `UPDATE utilisateur
       SET nom = $1,
           prenom = $2,
           email = $3,
           mot_de_passe = $4,
           role = $5
       WHERE id_utilisateur = $6
       RETURNING id_utilisateur, nom, prenom, email, role`,
      [
        nom || currentUser.nom,
        prenom || currentUser.prenom,
        email || currentUser.email,
        hashedPassword,
        role || currentUser.role,
        id,
      ]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur updateUser :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM utilisateur WHERE id_utilisateur = $1 RETURNING id_utilisateur",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    return res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    console.error("Erreur deleteUser :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// LOGIN user
const loginUser = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({
      message: "Email et mot de passe sont obligatoires",
    });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM utilisateur WHERE email = $1`,
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(
      mot_de_passe,
      user.mot_de_passe
    );

    if (!isPasswordValid) {
      return res.status(404).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    const token = jwt.sign(
      {
        id_utilisateur: user.id_utilisateur,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({
      message: "Connexion réussie",
      token,
    });
  } catch (error) {
    console.error("Erreur loginUser :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};