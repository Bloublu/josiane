const { request } = require('express');
const session = require('express-session');
const nodemailer = require('nodemailer');
const User = require('../models/user_models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// route mot de passe oublié (saisir email) GET
const forget = (req, res, next) => {
  try{     
    res.render('forget', {
      session: req.session,
      errors: req.flash('error'),
      infos: req.flash('infos'),
    });                       
  }catch(error){
    console.log(error);
  }
};

// route mot de passe oublié (saisir email) POST
const resetPassword = (req, res, next) => {
  
  try {
    //on verifie que le champ email n'est pas vide
    if (req.body.email == '') {
      req.flash('error', 'merci de remplir les champs email.');
      res.redirect('forget');   
    }else{
      //connection BDD
      req.getConnection(async (err, connection) =>{
        if (err) {
          return next(err);
        }
        // Select user via email saisi + requete MYSQL
        const userEmail = req.body.email;
        const sql = "SELECT id, email, pseudo FROM users WHERE email = ?";

        // Passage REQUETE ASYNC et redirection selon result
        await connection.query(sql, userEmail, async (err, result) => {             
          if (err || result[0] == undefined){
            req.flash('error', 'Nous n\'avons trouvé aucun email correspondant a votre saisi.');
            res.redirect('forget');
          }else {
            envoiMail(result[0]).catch(console.error);
            req.flash('info', 'un email vous a été envoyé pour reinitialiser votre mot de passe.');
            res.redirect('/');
          }
        });
      });
    }
  }catch(error){
    console.log(error);
  }
};

// route update mot de passe (nouveau mot de passe) GET
const changePassword = (req, res, next) => {
  try{ 
    //connection BDD
    req.getConnection(async (err, connection) =>{
      if (err) {
          return next(err);
      }
      // Select user via id url + requete
      const idUser = req.query.id || req.session.User.id;
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
          // on enregistre le user dans la session
          req.session.User = useer;

          res.render('changePassword', {
            session: req.session,
            errors: req.flash('error'),
            infos: req.flash('infos'),
          });
        }  
      });
    });
  }catch(error){
    console.log(error);
  }
} 

// route update mot de passe (nouveau mot de passe) POST
const updatePass =  (req, res, next) => {
  try{
    // On verifie: champs pas vide / les 2 password sont identique / Champs password > a 4 caracteres
    if (req.body.password === '' || req.body.confirmPassword === ''){
      req.flash('error', 'Merci de completer les 2 champs password.');
      res.redirect('changePassword');
    } else if (req.body.password != req.body.confirmPassword){
      req.flash('error', 'Les 2 champs ne sont pas identique !! ');
      res.redirect('changePassword');
    } else if (req.body.password.length < 4){
      req.flash('error', 'Le mot de passe doit contenir au moins 4 caracteres.');
      res.redirect('changePassword');
    } else {
      //connection BDD
      req.getConnection(async (err, connection) =>{
        if (err) {
          return next(err);
        }
        //criptage MP + requete
        const saisiPassword = await bcrypt.hash( req.body.password , await bcrypt.genSalt(saltRounds));
        const sql = " UPDATE users SET password = ? ";

        // Passage REQUETE ASYNC update password en BDD
        await connection.query(sql, saisiPassword, (error, row, fields) => {
          if (err){
            req.flash('error', 'Une erreur est survenue, veuillez essayer a nouveau, auquel cas contactez le support.');
            res.redirect('changePassword');
          }else {
            req.flash('info', 'Votre mot de passe a bien été modifier');  
            res.redirect('/');
          }
        });           
      });   
    }   
  }catch(error){
    console.log(error);
  }
}
  

module.exports = {
  forget,
  resetPassword,
  changePassword,
  updatePass,
}

// TODO retirer pour mettre email user 
const email1 = 'bastien.benariac@gmail.com';

// Functions envoie email appeler sur 'changePassword'
async function envoiMail(result) {
  
  const pseudo = result.pseudo;
  const email = result.email;
  const id = result.id;

  // param connect boite mail Bloublu
  let transporter = nodemailer.createTransport({
    host: "ssl0.ovh.net",
    port: 587,
    secure: false, 
    auth: {
      user: "contact@bloublu.fr", 
      pass: process.env.bloubluPass, 
    },
    tls: {
      rejectUnauthorized: false
      }
  });
  
  // Email envoyé avec destinataire et message
  await transporter.sendMail({
    from: "'Bloublu - Josiane 🐔'<contact@bloublu.fr>", 
    to: email1, 
    subject: "Reinitialisation Mot de passe ✔", 
    text: "Bonjour " + pseudo + ", vous recevez ce mail suite a votre demande de reinitialisation de mot de passe"
    +"C'est pourquoi nous vous communiquons ce code afin de finaliser votre demande"
    +"CODE : " + email, 
    html: "Bonjour " + pseudo + ", vous recevez ce mail suite a votre demande de reinitialisation de mot de passe"
    +"C'est pourquoi nous vous communiquons ce code afin de finaliser votre demande"
    +"<b>CODE : "  + email + id +"</b> <a href='http://localhost:3000/changePassword?id="+id+"'> Bouton </a>", // html body
  });
}