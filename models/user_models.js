
class User {

    constructor({id, email, pseudo, password, active, adm}) {
        this.id = id;
        this.email = email;
        this.pseudo = pseudo;
        this.password = password;
        this.active = active;
        this.adm = adm;
    }

getId(id){ return this.id; }
getEmail(email) { return this.email; }
getPseudo(pseudo) { return this.pseudo; }
getPassword(password) { return this.password; }
getActive(active) { return this.active; }
getAdm(adm) { return this.adm; }
 
setId(id) { this.id = id; }
setEmail(email) { this.email = email; }
setPseudo(pseudo) { this.pseudo = pseudo; }
setPassword(password) { this.password = password; }
setActive(active) { this.active = active; }
setAdm(adm) { this.adm = adm; }

}
module.exports = User;