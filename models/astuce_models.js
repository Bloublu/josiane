
class Astuce {

    constructor({id, date, titre, texte, photo, user_id}){
        this.id = id;
        this.date = date;
        this.titre = titre;
        this.texte = texte;
        this.photo = photo;
        this.user_id = user_id;
    }

    getId(id){return this.id;}
    getDate(date){return this.date;}
    getTitre(titre){return this.titre;}
    getTexte(texte){return this.texte;}
    getPhoto(photo){return this.photo;}
    getUser_id(user_id){return this.user_id;}

    setId(id){this.id = id;}
    setDate(date){this.date = date;}
    setTitre(titre){this.titre = titre;}
    setTexte(texte){this.texte = texte;}
    setPhoto(photo){this.photo = photo;}
    setUser_id(user_id){this.user_id = user_id;}
}
module.exports = Astuce;