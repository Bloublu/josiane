
class User {

    constructor({id, email, pseudo, password}) {
        this.id = id;
        this.email = email;
        this.pseudo = pseudo;
        this.password = password;
    }
getId(id){ return this.id; }
 getEmail(email) { return this.email; }
 getPseudo(pseudo) { return this.pseudo; }
 getPassword(password) { return this.password; }
 
 setId(id) { this.id = id; }
 setEmail(email) { this.email = email; }
 setPseudo(pseudo) { this.pseudo = pseudo; }
 setPassword(password) { this.password = password; }

}
module.exports = User;