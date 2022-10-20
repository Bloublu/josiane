// const mysql = require('mysql');
// const Schema = mysql.createConnection;

// const userSchema = new Schema({
//     id : { type: "_internal", bomAware: true},
//     email : { type : "string", require : true, unique : true},
//     pseudo : { type : "string", require : true, unique : true},
//     password : { type : "string", require : true}
// });

// module.exports = mysql.format('User', userSchema);
class User {

    constructor({email, pseudo, password}) {
        this.email = email;
        this.pseudo = pseudo;
        this.password = password;
    }
 getEmail(email) { return this.email; }
 getPseudo(pseudo) { return this.pseudo; }
 getPassword(password) { return this.password; }
 
 setEmail(email) { this.email = email; }
 setPseudo(pseudo) { this.pseudo = pseudo; }
 setPassword(password) { this.password = password; }

}
module.exports = User;