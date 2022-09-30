// import 
const express = require('express');
const path = require('path');
const presentation_routes = require('./routes/presentation_routes');
const names_routes = require('./routes/names_routes');
const astuce_routes = require('./routes/astuce_routes');
const partage_routes = require('./routes/partage_routes');
const recette_routes = require('./routes/recette_routes');
const games_routes = require('./routes/games_routes');

// instance variables
const app = express();
const port = 3000;

// connect BDD


// param
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

//routes
app.use('/', presentation_routes);
app.use('/', names_routes);
app.use('/', astuce_routes);
app.use('/', partage_routes);
app.use('/', recette_routes);
app.use('/', games_routes);

app.use((req, res) => {
   res.status(404);
   res.render('erreur404'); 
});

app.listen(port, () => {
    console.log(`Application lancée sur le port ${port}`);
});