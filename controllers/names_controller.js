const connection = require('express-myconnection');
const nameP = require('../models/namePoule_models');
const nameC = require('../models/namePoule_models');


const names = (req, res, next) =>{

    req.getConnection(async (err, connection) =>{
        if (err) {
            return next(err);
        }     
        await connection.query('SELECT nom FROM nompoules', [], (error, nameP) => {
            connection.query('SELECT nom FROM nomcoqs', [], (error, nameC) => {
                try{     
                     res.render('names', {
                        nameP: nameP,
                        nameC: nameC
                    });                       
                }catch(error){
                    console.log(error);
                }
            });
        });    
    }); 
};

const names_poule = async (req, res) => {
    res.render('names_poule');
};

const names_coq = (req, res) =>{
    res.render('names_coq');
};


module.exports = {
    names,
    names_poule,
    names_coq
};