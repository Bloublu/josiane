// import 
const express = require('express');
const path = require('path');

// instance variables
const app = express();
const port = 3000;

// connect BDD


// param
app.set('view engine', 'ejs');
app.set('view', path.join(__dirname, 'views'));
app.use(express.static('public'));

//routes

app.get('/', (req, res) => {
    res.render('laBase');
});

app.use((req, res) => {
   res.status(404);
   //todo: créer notre page perso err 404 et rediriger sur cette page plutot que le message ci dessous.
   res.send('Page non trouvée !!') 
});

app.listen(port, () => {
    console.log(`Application lancée sur le port ${port}`);
});