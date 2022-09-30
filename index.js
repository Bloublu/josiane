// import 
const express = require('express');
const path = require('path');
const presentation_routes = require('./routes/presentation_routes');
const names_routes = require('./routes/names_routes');
const astuce_routes = require('./routes/astuce_routes');

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

app.use((req, res) => {
   res.status(404);
   //todo: créer notre page perso err 404 et rediriger sur cette page plutot que le message ci dessous.
   res.send('Page non trouvée !!') 
});

app.listen(port, () => {
    console.log(`Application lancée sur le port ${port}`);
});