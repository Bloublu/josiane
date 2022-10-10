const mysql = require('mysql');
const Schema = mysql.createConnection;

const userSchema = new Schema({
    id : { type: "_internal", bomAware: true},
    email : { type : "string", require : true, unique : true},
    pseudo : { type : "string", require : true, unique : true},
    password : { type : "string", require : true}
});

module.exports = mysql.format('User', userSchema);
