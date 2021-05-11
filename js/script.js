///////////////////////////////
// Declaration des variables //
///////////////////////////////

const ganon = "ganon";
const link = "link";
let theme = new Audio("sounds/theme.mp3");
let combat = new Audio("sounds/combat.mp3");
let round;
let level;
let pvganon = 0;
let pvlink = 0;
let facile, normal, difficile; /* difficulte; */
let damages = 0;
let divGame;
let h3journalPartie;
let h3GameOverlink, h3GameOverganon;
let footerGameOverlink;
let footerGameOverganon;
let caption;
let figJournalInitiative;
let PvLink, PvGanon;
let PvTextLink, PvTextGanon;
let GanonAnime; 
let btnreplay;

///////////////////////////////
// Declaration des fonctions //
///////////////////////////////

// Permet d'attendre que le dom soit complétement chargé avant d'initialiser les variables afin d'éviter des erreurs.
document.addEventListener("DOMContentLoaded", function(event) { 
    PvLink = document.getElementById("pvLink");
    PvGanon = document.getElementById("pvGanon");
    PvTextLink = document.getElementById("pvTextLink");
    PvTextGanon = document.getElementById("pvTextGanon");
    GanonAnime = document.querySelector('.ganonAnim');
    LinkAnime = document.querySelector('.linkAnim');
    playMusique(theme);
});

//Obtenir un entier aléatoire dans un intervalle. =1 lancé de dé.
function getRandomInteger(max,min){
    let result = Math.floor(Math.random() * (max - min +1)) + min;
    return result;
}

//Obtenir la somme du resultat des lancés de dés en fonction du nombre de lancé et du nombre de faces.
function throwDices(nbrLance,nbrFace){
    let somme = 0;
    for (let i = 1; i < nbrLance; i++){
        somme = somme + getRandomInteger(1,nbrFace);
    }
    return somme;
}

// but : initialiser les paramètres du jeu.
function initializeGame(difficulte){
    round = 1;
    level = difficulte;
    switch (level) {
        case "facile":
            pvganon = 100 + throwDices(5,10);
            pvlink = 100 + throwDices(10,10);
            break;
        case "normal":
            pvganon = 100 + throwDices(10,10);
            pvlink = 100 + throwDices(10,10);
            break;
        case "difficile":
            pvganon = 100 + throwDices(10,10);
            pvlink = 100 + throwDices(7,10);
            break;
        default:
            break;
    }
    modifPv(pvganon, pvlink, true);

    document.getElementById("pre-game").remove();

    divGame = document.querySelector(".game");
    /*let newH2 = document.createElement("h2");
    newH2.textContent = "Que le combat commence !!"
    divGame.append(newH2); */

    let imgCombat = document.createElement("img");
    imgCombat.className = 'img_combat';
    imgCombat.setAttribute("src", "images/combat.jpg");
    divGame.append(imgCombat);

    let startBut = document.createElement("div");
    startBut.className = 'start_button';
    startBut.innerHTML = '<a onclick="play(), playSounds(`choice`), stopSounds(theme), playMusique(combat)" onmouseover="playSounds(`cursor`)">Commencer le combat !</a>'
    divGame.append(startBut);
}

// Permet d'initialiser les PV en début de partie et de les modifier durant la partie.
function modifPv(pvganon, pvlink, ini = false) {
    if (ini) {
        PvGanon.setAttribute("max", pvganon);
        PvLink.setAttribute("max", pvlink);
    }
    PvTextGanon.innerHTML = pvganon + " PV"
    PvTextLink.innerHTML = pvlink + " PV"
    PvGanon.setAttribute("value", pvganon);
    PvLink.setAttribute("value", pvlink);
}

//Determine qui obtient l'initiative
function getInitiative(){
    return (throwDices(10,6) > throwDices(10,6)) ? "ganon" : "link";
}

//Determine les dégats causés par le eprsonnage attaquant.
function atk(Perso) {
    if (level == 'facile')
        damages = (Perso == 'link') ? damages = ((throwDices(3,6)) + (Math.ceil(throwDices(2,6)/100))) : damages = ((throwDices(3,6)) - (Math.ceil(throwDices(2,6)/100)));
    else if (level == "difficile")
        damages = (Perso == 'link') ? damages = ((throwDices(3,6)) - (Math.ceil(throwDices(2,6)/100))) : damages = ((throwDices(3,6)) + (Math.ceil(throwDices(2,6)/100)));
    else
        damages = throwDices(3,6);
    return damages;
}

// Affiche le round, l'attaquant ayant l'initiative, les animations et le nombre de dégats causés dans la fenetre log au milieu
function journalPartie (round){
    divGame = document.querySelector(".game");
    h3journalPartie = document.createElement("h3");
    h3journalPartie.className = "focus";
    h3journalPartie.innerHTML = "Tour n° "+ round;

    figJournalInitiative = document.createElement("figure");
    if (getInitiative() == link) {
        damages = atk(link);
        figJournalInitiative.innerHTML = '<figure class="game-round"><img src="images/link_atk.png" alt="Link vainqueur"><figcaption>Vous êtes le plus rapide, vous attaquez Ganon et lui infligez ' + damages + ' points de dommage !</figcaption></figure>';
        pvganon -= damages;
        animateCSS('.linkAnim', 'wobble');
        soundAtkLink();
        setTimeout(() => {
            animateCSS('.ganonAnim', 'flash');
            soundBlesseGanon();
        }, 250);
        
    } else {
        damages = atk(ganon);
        figJournalInitiative.innerHTML = `<figure class="game-round"><img src="images/ganon_atk.png" alt="ganon vainqueur"><figcaption>Ganon prend l'initiative, vous attaque et vous inflige ` + damages + ` points de dommage !<figcaption></figure>`;
        pvlink -= damages;
        animateCSS('.ganonAnim', 'wobbleInv');
        soundAtkGanon();
        setTimeout(() => {
            animateCSS('.linkAnim', 'flash');
            soundBlesseLink();
        }, 250);
    }
}

//Créé le contenu du journal de log en fonction de l'avancé de la game.
function affichage() {
    if (pvlink <= 0) {
        let newGameBut = document.createElement("div");
        newGameBut.className = 'newGameBut';
        newGameBut.innerHTML = '<a onclick="newGame()" id="replay">Rejouer !</a>';
        divGame = document.querySelector(".game");
        divGame.prepend(newGameBut);
        gameOverlink();
    } else if (pvganon <= 0){
        let newGameBut = document.createElement("div");
        newGameBut.className = 'newGameBut';
        newGameBut.innerHTML = '<a onclick="newGame()" id="replay">Rejouer !</a>';
        divGame = document.querySelector(".game");
        divGame.prepend(newGameBut);
        btnreplay = document.getElementById("replay");
        btnreplay.style.display = "none";
        gameOverganon();
    } else {
        let nextBut = document.createElement("div");
        nextBut.className = 'next_button';
        nextBut.innerHTML = '<a onclick="play()">Tour suivant !</a>';
        divGame = document.querySelector(".game");
        divGame.prepend(nextBut);
        divGame.prepend(figJournalInitiative);
        divGame.prepend(h3journalPartie);
    } 
}

// Affiche le footer de fin de partie avec Ganon gagnant.
function gameOverlink(){
    divGame = document.querySelector(".game");

    h3GameOverlink = document.createElement("h3");
    h3GameOverlink.innerHTML = "Fin de la partie";

    footerGameOverlink = document.createElement("footer");
    footerGameOverlink.innerHTML = '<figure class="game-end"><figcaption>Vous avez perdu le combat, Ganon vous a terrassé !</figcaption><img src="images/ganon_win.png" alt="ganon vainqueur"></figure>';
    divGame.prepend(footerGameOverlink);
    divGame.prepend(h3GameOverlink);

    stopSounds(combat);
    animateCSS('.linkAnim', 'hinge');
    playSounds("ganonvictoire");

    function RemoveAnime() {
        LinkAnime.removeEventListener('animationend', RemoveAnime);
        PvTextLink.style.display = "none";
        PvLink.style.display = "none";
        LinkAnime.style.display = "none"; 
    }
    LinkAnime.addEventListener('animationend',RemoveAnime);

}

// Affiche le footer de fin de partie avec le link gagnant.
function gameOverganon(){
    divGame = document.querySelector(".game");

    h3GameOverganon = document.createElement("h3");
    h3GameOverganon.innerHTML = "Fin de la partie";

    let footerGameOverganon = document.createElement("footer");
    footerGameOverganon.innerHTML = '<figure class="game-end"><figcaption>Vous avez gagné le combat, Ganon est battu et vous avez sauvé la princesse Zelda !</figcaption><img src="images/link_win.png" alt="link vainqueur"></figure>';
    divGame.prepend(footerGameOverganon);
    divGame.prepend(h3GameOverganon);

    stopSounds(combat);
    animateCSS('.ganonAnim', 'hinge');
    playSounds("zeldasave");

    function RemoveAnime() {
        GanonAnime.removeEventListener('animationend', RemoveAnime);
        PvTextGanon.style.display = "none";
        PvGanon.style.display = "none";
        GanonAnime.style.display = "none"; 
        setTimeout(function() {
            ZeldaPop();
        }, 50);// ici y'a un bug 
    }
    GanonAnime.addEventListener('animationend',RemoveAnime);
}

// Permet d'afficher l'image de zelda à la place de celle de Ganon à la fin de la partie.
function ZeldaPop() {
    animateCSS('.ganonAnim', 'backInUp');
    setTimeout(function() {
        btnreplay.style.display = "initial";
    }, 2001);
    GanonAnime.style.display = "initial";
    GanonAnime.setAttribute("src", "images/zelda.png");
}

//Permet de faire revenir l'image de ganon ou link pour une nouvelle partie.
function looserBack() {
    if (pvganon <= 0) {
        GanonAnime.setAttribute("src", "images/ganon.png");
        PvTextGanon.style.display = "initial";
        PvGanon.style.display = "initial";
    } else {
        PvTextLink.style.display = "initial";
        PvLink.style.display = "initial";
        LinkAnime.style.display = "initial";
    }
}

//Permet de relancer une nouvelle partie.
function newGame() {
    looserBack();
    modifPv(1, 1, true);
    document.querySelector(".game").innerHTML = "";
    divGame = document.querySelector(".game");
    let divPreGame = document.createElement("div");
    divPreGame.id = "pre-game";
    divPreGame.innerHTML = `<h2>Veuillez saisir votre difficulté héro !</h2><div id="difficulty_choice"><div class="btn_diff" onclick="initializeGame('facile')"><img src="images/facile.PNG" alt="facile" onmouseover="playSounds('cursor')" onclick="playSounds('choice')"></div><div class="btn_diff" onclick="initializeGame('normal')"><img src="images/normal.png" alt="normal" onmouseover="playSounds('cursor')" onclick="playSounds('choice')"></div><div class="btn_diff" onclick="initializeGame('difficile')"><img src="images/difficile.PNG" alt="difficile" onmouseover="playSounds('cursor')" onclick="playSounds('choice')"></div></div>`;
    divGame.append(divPreGame);
}

//Fonctions qui permet d'attribuer une classe et de la supprimer juste apres l'avoir effectuée, afin de pouvoir la réutiliser apres avec injection JS.
const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd() {
      node.classList.remove(`${prefix}animated`, animationName);
      node.removeEventListener('animationend', handleAnimationEnd);

      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd);
  });

//Fonction sons

let listAtkLink = ['sounds/linkatk1.mp3',"sounds/linkatk2.mp3","sounds/linkatk3.mp3"];
let listAtkGanon = ['sounds/ganonatk1.mp3','sounds/ganonatk2.mp3','sounds/ganonatk3.mp3'];
let listBlesseLink = ['sounds/linkblesse1.mp3',"sounds/linkblesse2.mp3"];
let listBlesseGanon = ['sounds/ganonblesse1.mp3',"sounds/ganonblesse2.mp3"];

function soundAtkLink(){
    let sound = new Audio(listAtkLink[Math.floor(Math.random() * Math.floor(3))]);
    sound.play();
    sound.volume = 0.2;
}

function soundAtkGanon(){
    let sound = new Audio(listAtkGanon[Math.floor(Math.random() * Math.floor(3))]);
    sound.play();
    sound.volume = 0.2;
}

function soundBlesseLink(){
    let sound = new Audio(listBlesseLink[Math.floor(Math.random() * Math.floor(2))]);
    sound.play();
    sound.volume = 0.2;
}

function soundBlesseGanon(){
    let sound = new Audio(listBlesseGanon[Math.floor(Math.random() * Math.floor(2))]);
    sound.play();
    sound.volume = 0.2;
}

function playSounds(name) {
    let audio = new Audio("sounds/" + name + ".mp3")
    audio.play();
    audio.volume = 0.3;
}

function playMusique(name) {
    name.play();
    name.volume = 0.05;
}

function stopSounds(name) {
    name.currentTime = 0;
    name.pause();
}


///////////////////////
// Programme général //
///////////////////////

function play(){
    journalPartie(round);
    round += 1;
    if(pvganon <= 0)
        pvganon=0;
    if(pvlink <= 0)
        pvlink=0;
    modifPv(pvganon, pvlink)
    affichage();
}