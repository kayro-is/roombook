# 🚀 RoomBook – Application de réservation de salles

## 📌 Présentation

**RoomBook** est une application web permettant de gérer la réservation de salles de réunion au sein d’une entreprise.

Elle permet aux utilisateurs de :
- consulter les salles disponibles  
- réserver une salle à une date et un créneau précis  

---

## 🎯 Objectif du projet

L’objectif est de proposer une application simple, intuitive et fonctionnelle pour faciliter l’organisation des réunions en entreprise.

---

## 🧠 Conception

Le projet a été conçu en plusieurs étapes :

- 🔹 **Wireframes** : conception des interfaces  
- 🔹 **MCD (Modèle Conceptuel de Données)**  
- 🔹 **MLD (Modèle Logique de Données)**  
- 🔹 **MPD (Modèle Physique de Données)**  

---

## 🗄️ Base de données

La base de données est réalisée avec **PostgreSQL**.

### Tables principales :
- `utilisateur`
- `salle`
- `reservation`

### Relations :
- un utilisateur peut effectuer plusieurs réservations  
- une salle peut être réservée plusieurs fois  
- une réservation est liée à un utilisateur et une salle  

---

## ⚙️ Backend

Le backend est développé avec :

- **Node.js**
- **Express**
- **PostgreSQL (pg)**

### Fonctionnalités :
- API REST complète  
- gestion des utilisateurs  
- gestion des salles  
- gestion des réservations  
- authentification avec **JWT**  
- sécurisation des mots de passe avec **bcrypt**  
- gestion des erreurs  

---

## 🔐 Sécurité

- 🔒 Mots de passe hachés avec **bcrypt**  
- 🔑 Authentification sécurisée avec **JWT**  
- ⚙️ Variables sensibles stockées dans un fichier `.env`  
- 🛡️ Protection contre les conflits de réservation  

---

## 🎨 Frontend

Le frontend est développé avec :

- **React**
- **Axios**
- **Tailwind CSS**

### Fonctionnalités :
- inscription utilisateur  
- connexion  
- affichage des salles  
- réservation  
- interface moderne et responsive  

---

## 🧪 Tests

Les routes API ont été testées avec **Postman**.

---

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone https://github.com/kayro-is/roombook.git
cd roombook