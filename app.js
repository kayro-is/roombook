require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://roombook-amk.vercel.app"
    ],
    credentials: true,
  })
);

const salleRoutes = require('./routes/salleRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Bienvenue sur RoomBook!');
});

app.use('/salle', salleRoutes);
app.use('/utilisateur', userRoutes);
app.use('/reservation', reservationRoutes);

app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});