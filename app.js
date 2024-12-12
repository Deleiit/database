// Importer le module express
const express = require('express');
// Importer le module mongoose
const mongoose = require('mongoose');

// Connexion à la BDD
mongoose.connection.once('open', () => {
    console.log("Connexion à la base de données effectué");
});

// Quand la BDD aura des erreurs
mongoose.connection.on('error', () => {
    console.log("Erreur dans la BDD");
});

// Se connecter sur mongodb (async)
mongoose.connect("mongodb://127.0.0.1:27017/db_cocktail");

const Cocktail = mongoose.model('Cocktail', { title: String, content: String, author: String }, 'cocktails');

// Instancier un serveur et autoriser l'envoi json
// Instancier le server grâce à express
const app = express();

// AUTORISER LE BACK À RECEVOIR DES DONNÉES DANS LE BODY
app.use(express.json());

const cors = require('cors');
app.use(cors());

// Les routes url/point d'entrée
app.get('/cocktails', async (request, response) => {
    const cocktails = await Cocktail.find();

    if (cocktails.length == 0){
        return response.json({ code : "701" });
    };

    return response.json(cocktails);
});

app.get('/cocktails/:id', async (request, response) => {
    const idParam = request.params.id;

    const foundCocktail = await Cocktail.findOne({'_id' : idParam});

    if (!foundCocktail){
        return response.json({ code : "702" }); 
    }
    
    return response.json(foundCocktail); 
});

function ajouterPersonne() {
    const prenomInput = document.querySelector('input[aria-label="Prénom"]');
    const nomInput = document.querySelector('input[aria-label="Nom"]');
    
    const prenom = prenomInput.value.trim();
    const nom = nomInput.value.trim();
  
    if (prenom && nom) {
      // Récupérer les personnes existantes du local storage
      let personnes = JSON.parse(localStorage.getItem('personnes')) || [];
      // Ajouter la nouvelle personne avec un état de validation par défaut (false)
      personnes.push({ prenom, nom, valide: false });
      // Enregistrer à nouveau dans le local storage
      localStorage.setItem('personnes', JSON.stringify(personnes));
      // Réinitialiser les champs de saisie
      prenomInput.value = '';
      nomInput.value = '';
      // Mettre à jour l'affichage
      afficherPersonnes();
    }
  }

app.post('/save-Cocktail', async (request, response) => {
    const CocktailJson = request.body;

    const Cocktail = new Cocktail(CocktailJson);

    await Cocktail.save();

    return response.json(Cocktail);
});

app.delete('/cocktails/:id', async (request) => {
    const idParam = request.params.id;

    const foundCocktail = await Cocktail.deleteOne({ '_id': idParam });

    if (!foundCocktail){
        return response.json({ code : "702" }); 
    }

    return response.json({ code : "200" }); 
});

// Lancer le serveur
app.listen(3000, () => {
    console.log("Le serveur a démarré !");
});