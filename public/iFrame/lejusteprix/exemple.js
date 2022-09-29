// nos variables

let input        = document.querySelector('#prix');
let error        = document.querySelector('small');
let formulaire   = document.querySelector('#formulaire');
let coups = 0;
let nbchoisi;
error.style.display ='none';

let rejouer = document.querySelector('#boutonRejouer');
rejouer.style.display ='none';

let nbAleatoire = Math.floor(Math.random() * 1001);
console.log(nbAleatoire);

// nos fonctions

function verifier(nbchoisi){
    let instruction = document.createElement('div');

    if (nbchoisi < nbAleatoire){
        instruction.textContent ='tentative : '+ coups + ', vous avez choisi le nombre : ' + nbchoisi + ', c\'est PLUS !!'
        instruction.className ='instruction plus';
    }else if (nbchoisi > nbAleatoire){
        instruction.textContent ='tentative : '+ coups + ', vous avez choisi le nombre : ' + nbchoisi + ', c\'est MOINS !!'
        instruction.className ='instruction moins';
    }else {
        instruction.textContent ='tentative : '+ coups + ', vous avez choisi le nombre : ' + nbchoisi + ', c\'est GAGNE !!'
        instruction.className ='instruction fini';
        input.disabled = true;
        rejouer.style.display ='inline';
    }

    document.querySelector('#instructions').prepend(instruction);
};



// nos evenements

input.addEventListener('keyup', () => {
    if(isNaN(input.value)){
        error.style.display ='inline';
    }else {
        error.style.display ='none';
    }
});

formulaire.addEventListener('submit', (e)=>{
    e.preventDefault();

    if( isNaN(input.value) || input.value ==''){
        input.style.borderColor ='red';
        error.style.display ='inline';
    }else{
        input.style.borderColor ='black';
        coups++;
        nbchoisi= input.value;
        input.value ='';
        verifier(nbchoisi);
    }
});
