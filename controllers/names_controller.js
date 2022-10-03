const nameP = require('../models/namePoule_models');


    
    
const names = async (req, res) => { await connection.query('SELECT nom FROM nompoules', [], (error, result) => {
        try{
            console.log(result[0].nom);
            res.render('names', {result: result});
            console.log(result.length);
        }catch(error){
            console.log(error);
        }
    });   
};
    


const names_poule = async (req, res) => {
    await nameP.find();
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