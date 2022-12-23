
class Poule {

    constructor({id, nom, user_id}) {
        this.id = id;
        this.nom = nom;
        this.user_id = user_id;
        
    }
getId(id){ return this.id; }
 getNom(nom) { return this.nom; }
 getUser_id(user_id) { return this.user_id; }
 
 
 setId(id) { this.id = id; }
 setNom(nom) { this.nom = nom; }
 setUser_id(user_id) { this.user_id = user_id; }

}
module.exports = Poule;