const mysql = require('mysql');
const Schema = mysql.createConnection;

const namePouleSchema = new Schema({
    id : { type: "_internal", bomAware: true},
    nom : { tpe : "string", default : null, nullable : false },
    aime : { type : "Boolean", nullable : true}
});