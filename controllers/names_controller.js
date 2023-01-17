const { request } = require('express');
const connection = require('express-myconnection');
require("dotenv").config();
const [grossier] = require('../public/js/config');

// route names all
const names = (req, res, next) =>{
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        // on recupere le donnees de la BDD pour la tables nompoules et nomcoqs    
        await connection.query('SELECT nom FROM nompoules ORDER BY RAND() LIMIT 10', [], (error, nameP) => {
            connection.query('SELECT nom FROM nomcoqs ORDER BY RAND() LIMIT 10', [], (error, nameC) => {
                // envoie des listes de nom a la view
                try{     
                     res.render('names', {
                        nameP: nameP,
                        nameC: nameC,
                        infos: req.flash('info'),
                        errors: req.flash('error'),
                        session: req.session,
                    });                       
                }catch(error){
                    console.log(error);
                }
            });
        });    
    }); 
};

// route names Poules GET
const names_poule = async (req, res) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        }     
        // on recupere le donnees de la BDD pour la tables nompoules et nomcoqs    
        await connection.query('SELECT nom FROM nompoules ORDER BY nom ASC', [], (error, nameP) => {
                // envoie de la liste de nom a la view
                try{     
                     res.render('names_poule', {
                        nameP: nameP,
                        infos: req.flash('info'),
                        errors: req.flash('error'),
                        session: req.session,
                    });                       
                }catch(error){
                    console.log(error);
                }
        });    
    });
};

// route names Poules POST
const ajoutNamesPoule = (req, res, next) => {
    //connection bdd
    req.getConnection( async(err, connection) =>{
        if (err) {
            return next(err);
        }

        try {
            // on verifie que l'utilisateur est connecté
            if(req.session.User == null) {
                req.flash('error', 'merci de vous inscrire pour partager vos idées.');
                res.redirect('names_poule');
            }
            // on verifie que le champ nom // ne soit pas vide // ne soit pas supperieur a 15 carateres.
            if (req.body.nomPouleCoq == ''){
                req.flash('error', 'merci de remplir le champs nom POULE');
                res.redirect('names_poule');
            } else if (req.body.nomPouleCoq.length > 15){
                req.flash('error', 'Le nom ne doit pas depasser 15 caracteres');
                res.redirect('names_poule');
            }else {
                
                // on verifie que le champ nom ne comporte pas de grossièretés.
                for (let g of grossier) {
                    if (g === req.body.nomPouleCoq){
                        req.flash('error', 'Pas de grossièretés, svp !!');
                        res.redirect('names_poule');
                        return
                    }
                }
    

                // on recupere le donnees du formulaire
                const resultForm = req.body;
                // on recupere l'id de l'utilisateur
                const userId = req.session.User.id;
            
                // on mets en minuscule puis en majuscule la premiere du champs nom du formulaire
                const resultFormMin = resultForm.nomPouleCoq.toLowerCase();
                const resultFormMaj = resultFormMin[0].toUpperCase() + resultFormMin.slice(1);
                
                // creation objet Poule pour envoyer en BDD
                const nomPoule = [resultFormMaj, userId]

                // on verifie que le nom saisi n'est pas deja en BDD / eviter les doublons / si non on INSERT
                const sqlVerif = "SELECT nom FROM nompoules WHERE nom = ?";
                await connection.query(sqlVerif,resultFormMaj, async (error, result) => {
                    if (error){
                        req.flash('error', 'Une erreur est survenue lors de l\'enregistrement de votre idée.');
                        res.redirect('names_poule');
                    }else if (result.length > 0) {
                        req.flash('error', 'Ce nom existe déja, essaie encore.');
                        res.redirect('names_poule');
                    } else { 
                        //requete insert pour le formulaire poule
                        const sql = "INSERT INTO nompoules (nom, user_id) VALUES (?)"
                        await connection.query(sql, [nomPoule], (error, row, fields) => {
                            if (error){
                                req.flash('error', 'Une erreur est survenue lors de l\'enregistrement de votre idée.');
                                res.redirect('names_poule');
                            } 
                        }); 
                        req.flash('info', 'merci pour votre participation');
                        res.redirect('names_poule');
                    }                        
                });
            }
        }catch (error) {
            console.log(error);
        }
    });
};

// route names Coq GET
const names_coq = (req, res) =>{
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        }     
        // on recupere le donnees de la BDD pour la tables nomcoqs    
        await connection.query('SELECT nom FROM nomcoqs ORDER BY nom ASC', [], (error, nameC) => {
            // envoie de la liste de nom a la view
            try{     
                res.render('names_coq', {
                    nameC: nameC,
                    infos: req.flash('info'),
                    errors: req.flash('error'),
                    session: req.session,
                });                       
            }catch(error){
                console.log(error);
            }
        });    
    });
};

// route names Coq POST
const ajoutNamesCoq = (req, res, next) => {
    //connection bdd
     req.getConnection(async (err, connection) =>{
         if (err) {
             return next(err);
         }

         try {
            // on verifie que l'utilisateur est connecté
            if(req.session.User == null) {
                req.flash('error', 'merci de vous inscrire pour partager vos idées.');
                res.redirect('names_coq');
            }

            // on verifie que le champ nom // ne soit pas vide // ne soit pas supperieur a 15 carateres.
            if (req.body.nomPouleCoq == ''){
                req.flash('error', 'merci de remplir le champs nom COQ');
                res.redirect('names_coq');
            } else if (req.body.nomPouleCoq.length > 15){
                req.flash('error', 'Le nom ne doit pas depasser 15 caracteres');
                res.redirect('names_coq');
            }else {

                // on verifie que le champ nom ne comporte pas de grossièretés.
                for (let g of grossier) {
                    if (g === req.body.nomPouleCoq){
                        req.flash('error', 'Pas de grossièretés, svp !!');
                        res.redirect('names_coq');
                        return
                    }
                }

                // on recupere le donnees du formulaire
                const resultForm = req.body;

                // on recupere l'id de l'utilisateur
                const userId = req.session.User.id;

                // on mets en minuscule puis en majuscule la premiere du champs nom du formulaire
                const resultFormMin = resultForm.nomPouleCoq.toLowerCase();
                const resultFormMaj = resultFormMin[0].toUpperCase() + resultFormMin.slice(1);

                // creation objet Poule pour envoyer en BDD
                const nomCoq = [resultFormMaj, userId]

                // on verifie que le nom saisi n'est pas deja en BDD / eviter les doublons / si non on INSERT
                const sqlVerif = "SELECT nom FROM nomcoqs WHERE nom = ?";
                await connection.query(sqlVerif,resultFormMaj, async (error, result) => {
                    if (error){
                        req.flash('error', 'Une erreur est survenue lors de l\'enregistrement de votre idée.');
                        res.redirect('names_coq');
                    }else if (result.length > 0) {
                        req.flash('error', 'Ce nom existe déja, essaie encore.');
                        res.redirect('names_coq');
                    } else { 
                        //requete insert pour le formulaire poule
                        const sql = "INSERT INTO nomcoqs (nom, user_id) VALUES (?)"
                        await connection.query(sql, [nomCoq], (error, row, fields) => {
                            if (error){
                                req.flash('error', 'Une erreur est survenue lors de l\'enregistrement de votre idée.');
                                res.redirect('names_coq');
                            }
                        });
                        req.flash('info', 'merci pour votre participation');
                        res.redirect('names_coq'); 
                    }                        
                });
            }
        }catch (error) {
            console.log(error);
        }
    });
};

// route myName (noms poule et coq selon id user) GET
const myName = (req, res, next) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        // on recupere l'id user via session
        const idUser = req.session.User.id;

        // on recupere le donnees de la BDD pour la tables nompoules et nomcoqs SEULEMENT ceux qui ont id de l'user    
        await connection.query('SELECT id, nom FROM nompoules WHERE user_id = ?', idUser, (error, nameP) => {
            connection.query('SELECT id, nom FROM nomcoqs WHERE user_id = ?', idUser, (error, nameC) => {
                // envoie des listes de nom a la view
                try{     
                    res.render('myNames', {
                        nameP: nameP,
                        nameC: nameC,
                        infos: req.flash('info'),
                        errors: req.flash('error'),
                        session: req.session,
                    });                       
                }catch(error){
                    console.log(error);
                }
            });
        });    
    }); 
}

// route myName ( supprimer noms poule selon id name) POST
const suppNamePoule = (req, res, next) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        
            // on recupere l'ID du nom
            const idName = req.body.supp;
           
        try {
            
            // on passe la requete DELETE et on redirige    
            await connection.query('DELETE FROM nompoules WHERE id = ?', idName, async (error, result) => {
                if (err){
                    req.flash('error', "Une erreur est survenue lors de la suppression de votre idée.");
                    res.redirect('myNames');
                }else {
                    req.flash('info', 'Votre idée a été supprimé.');
                    res.redirect('myNames');
                }
            }); 
        }catch(error){
            console.log(error);
        }      
    });
}

// route myName ( supprimer noms coq selon id name) POST
const suppNameCoq = (req, res, next) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        
            // on recupere l'ID du nom
            const idName = req.body.supp;
           
        try {
            
            // on passe la requete DELETE et on redirige    
            await connection.query('DELETE FROM nomcoqs WHERE id = ?', idName, async (error, result) => {
                if (err){
                    req.flash('error', "Une erreur est survenue lors de la suppression de votre idée.");
                    res.redirect('myNames');
                }else {
                    req.flash('info', 'Votre idée a été supprimé.');
                    res.redirect('myNames');
                }
            }); 
        }catch(error){
            console.log(error);
        }      
    });
}

// route nomAdm (noms poule et coq pour les ADM) GET
const nomAdm = (req, res, next) => {
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

            // on recupere TOUTES les donnees de la BDD pour la tables nompoules et nomcoqs    
            await connection.query('SELECT id, nom, user_id FROM nompoules ORDER BY nom ASC', (error, nameP) => {
                connection.query('SELECT id, nom, user_id FROM nomcoqs ORDER BY nom ASC', (error, nameC) => {
                    // envoie des listes de nom a la view
                    try{     
                        res.render('nomAdm', {
                            nameP: nameP,
                            nameC: nameC,
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
    });
}

// route myName ( supprimer noms poule selon id name) POST
const ADMsuppNamePoule = (req, res, next) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        
            // on recupere l'ID du nom
            const idName = req.body.supp;
           
        try {
            
            // on passe la requete DELETE et on redirige    
            await connection.query('DELETE FROM nompoules WHERE id = ?', idName, async (error, result) => {
                if (err){
                    req.flash('error', "Une erreur est survenue lors de la suppression de votre idée.");
                    res.redirect('nomAdm');
                }else {
                    req.flash('info', 'Votre idée a été supprimé.');
                    res.redirect('nomAdm');
                }
            }); 
        }catch(error){
            console.log(error);
        }      
    });
}

// route myName ( supprimer noms coq selon id name) POST
const ADMsuppNameCoq = (req, res, next) => {
    //connection BDD
    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        } 
        
            // on recupere l'ID du nom
            const idName = req.body.supp;
           
        try {
            
            // on passe la requete DELETE et on redirige    
            await connection.query('DELETE FROM nomcoqs WHERE id = ?', idName, async (error, result) => {
                if (err){
                    req.flash('error', "Une erreur est survenue lors de la suppression de votre idée.");
                    res.redirect('nomAdm');
                }else {
                    req.flash('info', 'Votre idée a été supprimé.');
                    res.redirect('nomAdm');
                }
            }); 
        }catch(error){
            console.log(error);
        }      
    });
}

module.exports = {
    names,
    names_poule,
    ajoutNamesPoule,
    names_coq,
    ajoutNamesCoq,
    myName,
    suppNamePoule,
    suppNameCoq,
    nomAdm,
    ADMsuppNamePoule,
    ADMsuppNameCoq,

};