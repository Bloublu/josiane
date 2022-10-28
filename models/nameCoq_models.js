
class Coq {

    constructor({id, nom, aime}) {
        this.id = id;
        this.nom = nom;
        this.aime = aime;
        
    }
getId(id){ return this.id; }
 getEmail(nom) { return this.nom; }
 getPseudo(aime) { return this.aime; }
 
 
 setId(id) { this.id = id; }
 setEmail(nom) { this.nom = nom; }
 setPseudo(aime) { this.aime = aime; }

}
module.exports = Coq;