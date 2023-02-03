const { request } = require('express');
const connection = require('express-myconnection');
const Astuce = require('../models/Astuce_models');
const date = require('date-and-time');

// page astuces GET 
const astuce = (req, res, next) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        // on recupere le donnees de la BDD pour la table Astuces    
        await connection.query('SELECT id, date, titre, texte, photo, user_id FROM astuces ORDER BY date DESC', [], (error, result) => {
    
            // liste d'obj astuce
            let listAstuce = [];
            // on boucle sur les result de le requete
            for (let r of result){
                // on format notre date
                let dateBDD = new Date(r.date);
                let dateFormat = date.format(dateBDD, 'DD MMM YYYY');

                // on créé l'obj Astuce
                let ast = new Astuce({
                    id: r.id,
                    date: dateFormat,
                    titre: r.titre,
                    texte: r.texte,
                    photo: r.photo,
                    user_id: r.user_id,
                })
                // on ajoute l'obj a notre liste
                listAstuce.push(ast);
            }
                
            // envoie des listes d'objet a la view
            try{     
                res.render('astuces', {
                    astuce: listAstuce,
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

// page Astuce avec id GET
const astuceId = (req, res, next) => {
    const toto = req.query.id;
    console.log(toto);
    console.log('Alors ?? ');

    try{     
        res.render('astuce', {
            
            infos: req.flash('info'),
            errors: req.flash('error'),
            session: req.session,
        });                       
    }catch(error){
        console.log(error);
    }
}

module.exports = {
    astuce,
    astuceId,
};