// TODO voir quand on deconnect notre connection a la bdd (connection.end())
// import 
const express = require('express');
const path = require('path');
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash')
const home_routes = require('./routes/home_routes');
const names_routes = require('./routes/names_routes');
const astucePartage_routes = require('./routes/astucePartage_routes');
const recette_routes = require('./routes/recette_routes');
const games_routes = require('./routes/games_routes');
const user_routes = require('./routes/user_routes');

//connection Bdd
const mysql = require('mysql'), // node-mysql module
    myConnection = require('express-myconnection'), // express-myconnection module
    dbOptions = {
        host : 'localhost',
        user : 'root',
        password : '',
        database : process.env.bdd
    };

// instance variables
const app = express();
const port = 3000;

// param
app.set('view engine', 'ejs'); // gerer ejs
app.set('views', path.join(__dirname, 'views')); // path view
app.use(express.static('public')); //reduire route pour public
app.use(express.urlencoded({extended: false})); // pour que express puisse gerer les forms
app.use(express.json()); // utiliser le format json pour express
app.use(myConnection(mysql, dbOptions, 'single'));// utiliser connection BDD

// param session 
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat', // TODO keyboard cat est une clé, comme un code, il faut la modifier et la conserver a l'abri
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: true } // pour connection https secure
}));

app.use(flash()); // permet d'envoie des message a la view via controllers, marche avec les sessions

//routes
app.use('/', home_routes);
app.use('/', names_routes);
app.use('/ajoutPoule',names_routes);
app.use('/ajoutCoq',names_routes);
app.use('/', astucePartage_routes);
app.use('/', recette_routes);
app.use('/', games_routes);
app.use('/',user_routes);
app.use('/signup',user_routes);
app.use('/login',user_routes);
app.use('/disconnect',user_routes);
app.use('/forgetPassword',user_routes);
app.use('/pp',user_routes);


app.use((req, res) => {
   res.status(404);
   res.render('erreur404'); 
});

app.use((req, res) => {
    res.render('tropPetit'); 
 });

app.listen(port, () => {
    console.log(`Application lancée sur le port ${port}`);
});

