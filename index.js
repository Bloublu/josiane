// todo a priori mon chemin est bon, juste probleme de connection BDD. voir pakcage 'pool', puis 
//  faire un app.use de qquch pour utiliser ma connection. attention doit aussi gerer la deconnection
//  avec connection.end. mais plus tard.
//  On peut aussi voir la doc pour express-connections pour s'en servir a la place de pool, 
//  voir sinon supprimer.

// import 
const express = require('express');
const path = require('path');
//const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host : 'localhost',
//     user : 'root',
//     password : '',
//     database : 'josiane'
// });
// connection.connect();

const mysql = require('mysql'), // node-mysql module
    myConnection = require('express-myconnection'), // express-myconnection module
    dbOptions = {
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'josiane'
    };
  



//const myconnection = require('express-myconnection');
const presentation_routes = require('./routes/presentation_routes');
const names_routes = require('./routes/names_routes');
const astuce_routes = require('./routes/astuce_routes');
const partage_routes = require('./routes/partage_routes');
const recette_routes = require('./routes/recette_routes');
const games_routes = require('./routes/games_routes');

const nameP = require('./models/namePoule_models');
//const connection = require('express-myconnection');

// instance variables
const app = express();
const port = 3000;

// // connect BDD
// const optionBd = {
//     host : 'localhost',
//     user : 'root',
//     password : 'root',
//     database : 'josiane'
// };

// param
app.set('view engine', 'ejs'); // gerer ejs
app.set('views', path.join(__dirname, 'views')); // path view
app.use(express.static('public')); //reduire route pour public
//app.use(myconnection(connection)); // utiliser connection BDD
app.use(express.urlencoded({extended: false})); // pour que express puisse gerer les forms
app.use(express.json()); // utiliser le format json pour express

app.use(myConnection(mysql, dbOptions, 'single'));

//routes
app.use('/', presentation_routes);
app.use('/', names_routes);

// app.get('/names', async (req, res) => {
    
    
//     await connection.query('SELECT nom FROM nompoules', [], (error, result) => {
//         try{
//             console.log(result[0].nom);
//             res.render('names', {result: result});
//             console.log(result.length);
//         }catch(error){
//             console.log(error);
//         }
//     });   
    
// });

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

