const User = require('../models/user_models');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const connection = require('express-myconnection');
const { request }  = require('express');
const session = require('express-session');
const { callbackPromise } = require('nodemailer/lib/shared');
const saltRounds = 10;


    


//route creation user (s'inscrire) GET
const sign = (req, res, next) => {
    try{     
        res.render('signup', {
            session: req.session,
            errors: req.flash('error'),
            infos: req.flash('infos'),
        });                       
   }catch(error){
       console.log(error);
   }
}

//route creation user (s'inscrire) POST
const signup = (req, res, next) => {
    try {
        // On verifie: champs pas vide / les 2 password sont identique  / Champs password < a 4 caracteres / Champs password > a 20 caracteres
        if (req.body.email == '' || req.body.password == '') {
            req.flash('error', 'merci de remplir au moins les champs email et mot de passe.');
            res.redirect('signup');
        } else if (req.body.password != req.body.confirmPassword){
            req.flash('error', 'Les 2 champs mot de passe ne sont pas identique !! ');
            res.redirect('signup');
        } else if (req.body.password.length < 4){
            req.flash('error', 'Le mot de passe doit contenir au moins 4 caracteres.');
            res.redirect('signup');
        } else if (req.body.password.length > 20){
            req.flash('error', 'Le mot de passe doit contenir moins 20 caracteres.');
            res.redirect('signup');
        } else {
            //connection BDD
            req.getConnection(async (err, connection) =>{
                if (err) {
                    return next(err);
                }
                // Select user via email saisi + requete MYSQL
                const mailUser = req.body.email;
                const sql = "SELECT id, email, pseudo, password FROM users WHERE email = ?";

                // Passage REQUETE ASYNC et redirection selon result
                await connection.query(sql, mailUser, async (err, result) => {             
                    if(err){
                        req.flash('error', 'Une erreur est survenue, veuillez essayer a nouveau, auquel cas contactez le support.');
                        res.redirect('signup');
                    }else if(result.length > 0) {
                        req.flash('error', 'Cette adresse email existe déja. Connectez vous ou cliquer sur mot de passe oublié.');
                        res.redirect('signup');
                    }else {
                        //criptage MP
                        const saisiMpString = await bcrypt.hash( req.body.password , await bcrypt.genSalt(saltRounds));
                        
                        // creation obj user avec les données saisi
                        const user = new User({
                            email: req.body.email,
                            pseudo: req.body.pseudo,
                            password: saisiMpString,
                            active: false,
                            adm: false,
                        });

                        // On insert le user en BDD
                        const sql = " INSERT INTO users SET ? ";
                        await connection.query(sql, user, (error, result) => {
                            if (err){
                                req.flash('error', 'Une erreur est survenue, veuillez essayer a nouveau, auquel cas contactez le support.');
                                res.redirect('signup');
                            }else {
                                
                                user.id = result.insertId;
                                
                                envoiMail(user).catch(console.error);
                                req.flash('info', 'un email vous a été envoyé pour ACTIVER votre compte.');
                                res.redirect('/');
                            }
                        }); 
                    }
                });          
            });
        }
    }catch(error){
        console.log(error);
    }  
}

//route renvoie mail Active compte user GET
const renvoie = (req, res, next) => {
    try{     
        res.render('envoiMail', {
            session: req.session,
            errors: req.flash('error'),
            infos: req.flash('infos'),
        });                       
   }catch(error){
       console.log(error);
   }
}

// route renvoie mail Active compte user POST
const renvoieMail = (req, res, next) => {
    try {
        // On verifie: champs pas vide 
        if (req.body.email == '' || req.body.password == '') {           
             req.flash('error', 'merci de remplir les champs email et mot de passe.');
             res.redirect('renvoie');  
        }else{
            //connection BDD
            req.getConnection(async (err, connection) =>{
                if (err) {
                    return next(err);
                }
                // Select user via email saisi + requete MYSQL
                const mailUser = req.body.email;
                const sql = "SELECT id, email, pseudo, password FROM users WHERE email = ?";

                // Passage REQUETE ASYNC et redirection selon result
                await connection.query(sql, mailUser, async (err, result) => {             
                    if (err || result[0] === undefined){
                        req.flash('error', "Paire login/password incorrect.");
                        res.redirect('renvoie');
                    }else {
                        // creation obj via result requete
                        const useer = new User ({
                            id: result[0].id,
                            email: result[0].email,
                            pseudo: result[0].pseudo,
                            password: result[0].password,
                        })
                        // variable pour comparer mot de passe (saisi et bdd) avec bcrypt
                        const forSalt = req.body.password;
                        const validPepper = bcrypt.compareSync(forSalt, useer.password);

                        // Redirection selon si MP valide ou pas
                        if (validPepper) { 
                            // si OK renvoie mail pour active compte user
                            envoiMail(useer).catch(console.error);
                            req.flash('info', 'un email vous a été envoyé pour ACTIVER votre compte.');
                            res.redirect('/');
                        }else {
                            req.flash('error', 'Paire login/password incorrect.');
                            res.redirect('renvoie');
                        }
                    }  
                });
            });
        }
    }catch(error){
        console.log(error);
    } 
}

// route activer compte user GET
const active = (req, res, next) => {
    try{ 
      //connection BDD
      req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        }
        // recupere id user via query ou session + requete
        let idUser;
        if (req.query.id != null){
          idUser = req.query.id.replace(process.env.crip, '').replace(process.env.cripp, '');
        }else if (req.session.User.id != null){
          idUser =  req.session.User.id;
        }
        console.log(idUser);
        const sql = "SELECT id, email, pseudo FROM users WHERE id = ?";
  
        // Passage REQUETE ASYNC et traitement selon result
        await connection.query(sql, idUser, async (err, result) => {             
            if (err || result[0] === undefined){
            req.flash('error', 'Une erreur est survenue, nous n\avons pas reussi a vous indentifié, contactez notre support client. Merci');
            res.redirect('/');
            }else {
                // creation obj via requete select bdd
                const useer = new User ({
                id: result[0].id,
                email: result[0].email,
                pseudo: result[0].pseudo,
                })
                // on passe la colonne 'active' en bdd a true
                const sql = " UPDATE users SET active = true WHERE id = ? ";
                await connection.query(sql, idUser, async (err, result) => {             
                    if (err){
                    req.flash('error', 'Une erreur est survenue, nous n\avons pas reussi a vous indentifié, contactez notre support client. Merci');
                    res.redirect('/');
                    }else {
                        // on enregistre le user dans la session
                        console.log(useer);
                        req.session.User = useer;
                        req.flash('info', 'Votre compte a bien été activé.');
                        res.redirect('/');
                        
                    }
                });
            }  
        });
      });
    }catch(error){
      console.log(error);
    }
} 

// route connection user (se conecter) GET
const login = (req, res, next) => {
    try{     
        res.render('login', {
            session: req.session,
            errors: req.flash('error'),
            infos: req.flash('infos'),
            noValide: req.flash('noValide'),
        });                       
   }catch(error){
       console.log(error);
   }
}

// route connection user (se conecter) POST
const connect = (req, res, next) => {
    try {
        // On verifie: champs pas vide 
        if (req.body.email == '' || req.body.password == '') {           
             req.flash('error', 'merci de remplir les champs email et mot de passe.');
             res.redirect('login');  
        }else{
            //connection BDD
            req.getConnection(async (err, connection) =>{
                if (err) {
                    return next(err);
                }
                // Select user via email saisi + requete MYSQL
                const mailUser = req.body.email;
                const sql = "SELECT id, email, pseudo, password, active, adm FROM users WHERE email = ?";

                // Passage REQUETE ASYNC et redirection selon result
                await connection.query(sql, mailUser, async (err, result) => {             
                    if (err || result[0] === undefined){
                        req.flash('error', "Aucun email ne correspond a votre saisi.");
                        res.redirect('login');
                    }else {
                        // creation obj via result requete
                        const useer = new User ({
                            id: result[0].id,
                            email: result[0].email,
                            pseudo: result[0].pseudo,
                            password: result[0].password,
                            active: result[0].active,
                            adm: result[0].adm,
                        })
                        
                        // variable pour comparer mot de passe (saisi et bdd) avec bcrypt
                        const forSalt = req.body.password;
                        const validPepper = bcrypt.compareSync(forSalt, useer.password);
                        
                        // Redirection selon si MP valide ou pas et compte activé ou pas 

                        if (!validPepper) {
                            req.flash('error', 'Paire login/password incorrect.');
                            res.redirect('login');  
                        } else if (useer.active != 1){ // on verifie que le compte a ete activé
                            req.flash('noValide', 'Votre compte n\'a pas encore été activé. Lors de votre insciption, un email vous a été envoyé.');
                            res.redirect('login');  
                        } else if (validPepper) { 
                            // on enregistre le user dans la session
                            req.session.User = useer;
                            res.redirect('/');
                        }else {
                            req.flash('error', 'Une erreur est survenue, veuillez essayer a nouveau, auquel cas contactez le support.');
                            res.redirect('login');
                        }
                        
                    }  
                });
            });
        }
    }catch(error){
        console.log(error);
    } 
}

//route deconnection user (se deconecter) GET
const disconnect = (req, res, next) => {
    try{     
        // on supprime le user dans la session
        req.session.destroy();
        res.redirect('/');                      
   }catch(error){
       console.log(error);
   }
    
}

// route param user (modifier ou supprimer compte) GET
const params = (req, res, next) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        
            // on recupere l'ID du user
            const idUser = req.session.User.id;
           

            
            // on recupere le donnees user de la BDD via id session    
            await connection.query('SELECT id, email, pseudo FROM users WHERE id = ?', idUser, async (error, User) => {
                    // envoie infos user a la view
                    try{     
                        res.render('params', {
                            user: User,
                            infos: req.flash('info'),
                            errors: req.flash('error'),
                            session: req.session,
                        });                       
                    }catch(error){
                        console.log(error);
                    }
                
            });    
        
    });
}

// route param pour supprimer compte user GET
const deleteUser = (req, res, next) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        
            // on recupere l'ID du user
            const idUser = req.session.User.id;
           
        try {
            
            // on recupere le donnees user de la BDD via id session    
            await connection.query('DELETE FROM users WHERE id = ?', idUser, async (error, User) => {
                if (err){
                    req.flash('error', "Paire login/password incorrect.");
                    res.redirect('params');
                }else {
                    // on supprime le user dans la session
                    req.session.User = undefined;

                    req.flash('info', 'Votre compte a bien ete supprimer.');
                    res.redirect('/');
                }
            }); 
        }catch(error){
            console.log(error);
        }      
    });
}

// route param pour modifier compte user POST
const modifParams = (req, res, next) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        }

        try { 
            if (req.session.User.email === req.body.email && req.session.User.pseudo === req.body.pseudo){
                req.flash('info', 'Pas besoin de valider, vous avez apporté aucune modification à votre compte.');
                res.redirect('params');

            } else {
                // on recupere la liste des emails en bdd et on verifie qu'il n'y a pas de doublon avec un autre id
                await connection.query ('SELECT id, email FROM users', [], async (err, result) => {
                    for (let r of result) {
                        if (r.email === req.body.email && r.id != req.session.User.id) {
                            req.flash('error','cette adresse mail existe déja et est attribuée a un autre utilisateur.');
                            res.redirect('params');
                            return;
                        } 
                     } //else {
                            // on recupere l'ID du user
                            const idUser = req.session.User.id;
                            //on recupere les données saisi formulaire
                            const email = req.body.email;
                            const pseudo = req.body.pseudo;
                            
                            // requete sql
                            const sql = 'UPDATE users SET email = ?, pseudo = ? WHERE id = ?';
                            
                            // requete update via saisi form page params    
                            await connection.query(sql, [email, pseudo, idUser], async (error, User) => {
                                if (err){
                                    req.flash('error', "Une erreur est survenue, veuillez essayer a nouveau, auquel cas contactez le support. ");
                                    res.redirect('params');
                                }else {
                                    // on met a jour les info dans la session 
                                    req.session.User.email = email;
                                    req.session.User.pseudo = pseudo;

                                    req.flash('info', "Votre compte a bien été modifier. ");
                                    res.redirect('/');
                                }
                            });
                       // }
                      
                    //} 
                }); 
            }
        }catch(error){
            console.log(error);
        }      
   }); 
}

// route ADM param pour modifier ou supprimer compte user GET
const usersAdm = (req, res, next) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        
        // On recupere champ adm user via session
        const idAdm = req.session.User.adm;
        if (!idAdm) {
            req.flash('error','vous ne pouvez acceder a cette page.');
            res.redirect('/');
        }else {
            
            // on recupere le donnees user de la BDD via id session    
            await connection.query('SELECT id, email, pseudo, active, adm FROM users', async (error, User) => {
                // envoie infos user a la view
                try{     
                    res.render('usersAdm', {
                        user: User,
                        infos: req.flash('info'),
                        errors: req.flash('error'),
                        session: req.session,
                    });                       
                }catch(error){
                    console.log(error);
                }
                
            }); 
        }   
        
    });
}

// route ADM param pour Modifier compte user POST
const updateUser = (req, res, next) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        
            // on recupere l'id du user a mettre a jour
            const idUser = req.body.upUsers;

            // on recupere nos saisis du form pour update
            let active = false;
            if (req.body.active == 'on'){active = true;}

            let adm = false;
            if (req.body.adm == 'on'){adm = true;}

            let email =  req.body.email;
            let pseudo = req.body.pseudo;
           
        try {
            // requete sql
            const sql = 'UPDATE users SET email = ?, pseudo = ?, active = ?, adm = ? WHERE id = ?';

            // on passe la requete update et on redirige    
            await connection.query(sql, [email, pseudo, active, adm, idUser], async (error, result) => {
                if (err){
                    req.flash('error', "Une erreur est survenu");
                    res.redirect('usersAdm');
                }else {
                    req.flash('info', 'Le compte a bien été mis a jour.');
                    res.redirect('usersAdm');
                }
            }); 
        }catch(error){
            console.log(error);
        }      
    });
}

// route ADM param pour Supprimer compte user POST
const admDeleteUser = (req, res, next) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        
        // on recupere l'id du user a mettre a jour
         const idUser = req.query.id;
           
        try {
            // requete sql
            const sql = 'DELETE FROM users WHERE id = ?';

            // on passe la requete update et on redirige    
            await connection.query(sql, idUser, async (error, result) => {
                if (err){
                    req.flash('error', "Une erreur est survenu");
                    res.redirect('usersAdm');
                }else {
                    req.flash('info', 'Le compte a bien été supprimé.');
                    res.redirect('usersAdm');
                }
            }); 
        }catch(error){
            console.log(error);
        }      
    });
}

module.exports = {
    sign,
    login,
    signup,
    renvoie,
    renvoieMail,
    connect,
    active,
    disconnect,
    params,
    deleteUser,
    modifParams,
    usersAdm,
    updateUser,
    admDeleteUser,
}

// Functions envoie email appeler sur 'changePassword'
async function envoiMail(result) {
  
    const pseudo = result.pseudo;
    const email = result.email;
    const id = process.env.crip+result.id+process.env.cripp;
    
    // param connect boite mail Bloublu
    let transporter = nodemailer.createTransport({
      host: "ssl0.ovh.net",
      port: 587,
      secure: false, 
      auth: {
        user: "contact-josiane@bloublu.com", 
        pass: process.env.bloubluPass, 
      },
      tls: {
        rejectUnauthorized: false
        }
    });
    
    // Email envoyé avec destinataire et message
    await transporter.sendMail({
      from: "'Bloublu - Josiane 🐔'<contact-josiane@bloublu.com>", 
      to: email, 
      subject: "Validation compte ✔", 
  
      html: "<div style='text-align: center; border: 10px solid rgb(95, 88, 88); background-color: #fffcb9e8; padding: 15px; margin: 15px;'>"
      +" Bonjour <strong>" + pseudo + "</strong> et bienvenue chez Josiane<br><br>"
      +"Pour finaliser votre inscription, veuillez cliquer sur le lien ci-dessous :<br><br>"
      +"<strong> <a href='http://localhost:3000/active?id="+id+"'> ACTIVER </a></strong> <br><br>"
      +"Si vous n’êtes pas à l'origine de cette action, veuillez nous contacter a l'adresse : <strong> contact-josiane@bloublu.com </strong><br><br>"
      +"Merci et à bientôt chez Josiane"
      + ` <img src="cid:unique" width="40%" />  </div>`, // html body
  
      attachments: [{
        filename: 'josiane&vers.png',
        path: 'public/images/josiane&vers.png',
        cid: 'unique' 
        }]
    });
}
