import './style.css'
import { supabase } from './supabase.js'
import { initialiserGestionEtapes } from './admin-etapes.js'
const app = document.querySelector('#app')

if (!app) {
  throw new Error('Élément #app introuvable dans index.html.')
}

// --------------------------------------------------
// LES 16 ÉTAPES DU RALLYE
// --------------------------------------------------

const stages = [
  { number: 1, name: 'Office de tourisme de Saint-Martin-de-Ré', title: 'Bienvenue à Saint-Martin-de-Ré', intro: "Toute aventure a un point de départ. Retrouvez l’office de tourisme pour lancer votre parcours.", lat: 46.205735, lon: -1.365491, riddle: "Je suis le lieu où les visiteurs viennent chercher des cartes, des conseils et des idées pour découvrir l’Île de Ré. Qui suis-je ?", answers: ['office de tourisme', 'l office de tourisme', 'office tourisme', 'office du tourisme', 'office de tourisme de saint martin'], hint: 'On y trouve des cartes et des informations touristiques.' },
  { number: 2, name: 'La Citadelle de Vauban', title: 'La Citadelle', intro: "Rejoignez les fortifications de Saint-Martin-de-Ré et observez ce lieu chargé d’histoire.", lat: 46.204928, lon: -1.358847, riddle: "Je suis une construction défensive en forme d’étoile, imaginée pour protéger la ville et son port. Quel est mon nom ?", answers: ['la citadelle', 'citadelle', 'citadelle vauban', 'vauban'], hint: 'Le nom de ce lieu commence par « Cit… ».' },
  { number: 3, name: 'Porte de Toiras', title: 'La Porte de Toiras', intro: "Approchez-vous de cette porte historique des fortifications de Saint-Martin.", lat: 46.200413, lon: -1.361900, riddle: "Je porte le nom d’un maréchal de France qui défendit l’île lors du siège de 1627. Quel est mon nom ?", answers: ['toiras', 'porte de toiras', 'jean de saint bonnets de toiras', 'saint bonnet de toiras'], hint: 'Cherchez le nom inscrit sur la porte.' },
  { number: 4, name: 'Gendarmerie', title: 'En route vers la gendarmerie', intro: "Rejoignez le secteur de la gendarmerie et observez les aménagements autour de vous.", lat: 46.193706, lon: -1.356675, riddle: "Le pont de l’île a été inauguré en 1988. En quelle année a-t-il été inauguré ?", answers: ['1988', 'mille neuf cent quatre vingt huit'], hint: 'La réponse est une année.' },
  { number: 5, name: 'Moulin de Bellère', title: 'Le Moulin de Bellère', intro: "Un moulin vous attend. Observez les éléments du paysage et gardez l’œil ouvert.", lat: 46.193460, lon: -1.370209, riddle: "Parmi les noms suivants, lequel est l’intrus qui ne désigne pas un cépage traditionnel de l’île : Syrah, Colombard, Ugni blanc ?", answers: ['syrah'], hint: 'C’est le nom qui est déjà indiqué dans la question.' },
  { number: 6, name: 'Église du Bois-Plage', title: 'L’église du Bois-Plage', intro: "Rejoignez l’église du Bois-Plage-en-Ré et prenez un instant pour regarder son architecture.", lat: 46.185275, lon: -1.392716, riddle: "Vous êtes devant l’église du village. Quel élément surmonte le clocher : une croix, une girouette ou une statue ?", answers: ['croix', 'une croix'], hint: 'Levez les yeux vers le sommet du clocher.' },
  { number: 7, name: 'Église de La Couarde', title: 'L’église de La Couarde', intro: "Vous voici à La Couarde. Une photo souvenir de votre équipe vous attend ici.", lat: 46.194149, lon: -1.424486, riddle: "Pour valider cette étape, prenez une photo de votre équipe devant l’église de La Couarde.", photo: true, answers: [], hint: 'Choisissez une photo prise sur place.' },
  { number: 8, name: 'Marais salants de Loix', title: 'Les marais salants de Loix', intro: "Entrez dans l’univers des marais salants. Observez les bassins et le travail des sauniers.", lat: 46.208995, lon: -1.450798, riddle: "Quel vêtement traditionnel le petit âne de l’île porte-t-il pour se protéger des moustiques ?", answers: ['culotte', 'une culotte', 'pantalon', 'un pantalon'], hint: 'Il s’agit d’un vêtement porté sur les pattes arrière.' },
  { number: 9, name: 'Pick-Sel', title: 'Pick-Sel', intro: "Rejoignez Pick-Sel et découvrez l’univers du sel rétais.", lat: 46.211036, lon: -1.439911, riddle: "Quel outil le saunier utilise-t-il pour pousser et récolter le gros sel ?", answers: ['simoussi', 'la simoussi', 'las', 'lousse', 'lousse à fleur'], hint: 'Le nom de cet outil est propre au vocabulaire des marais salants.' },
  { number: 10, name: 'Moulin à marée de Loix', title: 'Le moulin à marée', intro: "Découvrez le moulin à marée et son lien avec les mouvements de l’océan.", lat: 46.215955, lon: -1.439300, riddle: "Quel phénomène naturel permettait autrefois de faire tourner ce moulin ?", answers: ['la maree', 'les marees', 'la force de la maree', 'le mouvement des marees'], hint: 'Le phénomène fait monter et descendre le niveau de la mer.' },
  { number: 11, name: 'Bassin du Goisil', title: 'Le bassin du Goisil', intro: "Vous voici au Goisil. Observez les chenaux, les bateaux et les repères de navigation.", lat: 46.193310, lon: -1.437285, riddle: "À quoi servent les balises qui bordent un chenal de navigation ?", answers: ['guider les bateaux', 'a guider les bateaux', 'indiquer le chenal', 'baliser le chenal', 'indiquer la route aux bateaux'], hint: 'Elles aident les marins à suivre le bon passage.' },
  { number: 12, name: 'Réostréa', title: 'Réostréa', intro: "Faites une pause et observez l’univers de l’ostréiculture rétaise.", lat: 46.204644, lon: -1.381815, riddle: "Citez quatre animaux ou crustacés que l’on peut retrouver dans l’environnement du littoral rétais.", answers: [], freeAnswer: true, hint: 'Pensez par exemple aux crabes, crevettes et coquillages.' },
  { number: 13, name: 'Rue Mérindot – Maison de la Vinaterie', title: 'La rue Mérindot', intro: "Retrouvez la rue Mérindot et la Maison de la Vinaterie.", lat: 46.203004, lon: -1.369752, riddle: "Quel mot désigne le lieu où l’on conserve et élève le vin ?", answers: ['chai', 'un chai', 'la cave', 'cave'], hint: 'Ce mot est souvent utilisé dans le vocabulaire viticole.' },
  { number: 14, name: 'Église Saint-Martin', title: 'L’église Saint-Martin', intro: "Vous retrouvez le cœur historique de Saint-Martin-de-Ré. Observez l’église.", lat: 46.203148, lon: -1.368377, riddle: "Quel élément architectural permet aux cloches de l’église de sonner ?", answers: ['clocher', 'le clocher', 'les cloches', 'les cloches du clocher'], hint: 'Il s’élève au-dessus de l’église.' },
  { number: 15, name: 'Port de Saint-Martin', title: 'Le port de Saint-Martin', intro: "Dernière photo souvenir : immortalisez votre équipe au port de Saint-Martin-de-Ré.", lat: 46.206432, lon: -1.367857, riddle: "Prenez une photo de votre équipe au port pour garder un souvenir de votre aventure.", photo: true, answers: [], hint: 'Votre photo doit être prise au port.' },
  { number: 16, name: 'Office de tourisme – arrivée', title: 'L’arrivée !', intro: "Vous avez bouclé votre aventure. Revenez à l’office de tourisme de Saint-Martin-de-Ré pour terminer le rallye.", lat: 46.205735, lon: -1.365491, riddle: "Bravo ! Pour clôturer le rallye, écrivez le mot qui résume le mieux votre aventure.", answers: [], freeAnswer: true, finish: true, hint: 'Un mot qui vous ressemble !' }
]

// Photos de l'Île de Ré utilisées en fond des étapes
const photosEtapes = {
  1: 'https://www.iledere.com/app/uploads/iledere/2024/08/thumbs/port-vue-aerienne-fortification-saint-martin-ile-de-re-jules-serrurier-1920x480.webp',
  2: 'https://api.cloudly.space/resize/cropratio/640/640/75/aHR0cHM6Ly9zdGF0aWMuYXBpZGFlLXRvdXJpc21lLmNvbS9maWxlc3RvcmUvb2JqZXRzLXRvdXJpc3RpcXVlcy9pbWFnZXMvNjQvMTUzLzM3NjU2ODk2LmpwZw%3D%3D/image.webp',
  3: 'https://www.iledere.com/app/uploads/iledere/2021/05/thumbs/page-fortifications-destination-cote-atlantiquefarid-makhlouf-ile-de-re-bd-47-640x320.webp',
  4: 'https://www.iledere.com/app/uploads/iledere/2024/06/thumbs/cycliste-couple-phare-saint-martin-ile-de-re-destination-cote-atlantique-farid-fakhlouf-640x320-crop-1719579379.webp',
  5: 'https://www.iledere.com/app/uploads/iledere/2024/08/thumbs/port-vue-aerienne-fortification-saint-martin-ile-de-re-jules-serrurier-1920x480.webp',
  6: 'https://www.iledere.com/app/uploads/iledere/2024/07/thumbs/eglise-saint-martin-ile-de-re-jules-serrurier-640x320.webp',
  7: 'https://www.iledere.com/app/uploads/iledere/2024/07/thumbs/eglise-saint-martin-ile-de-re-jules-serrurier-640x320.webp',
  8: 'https://api.cloudly.space/resize/cropratio/640/640/75/aHR0cHM6Ly9zdGF0aWMuYXBpZGFlLXRvdXJpc21lLmNvbS9maWxlc3RvcmUvb2JqZXRzLXRvdXJpc3RpcXVlcy9pbWFnZXMvNTAvMTgxLzM3MjA1Mjk4LmpwZw%3D%3D/image.webp',
  9: 'https://api.cloudly.space/resize/cropratio/640/640/75/aHR0cHM6Ly9zdGF0aWMuYXBpZGFlLXRvdXJpc21lLmNvbS9maWxlc3RvcmUvb2JqZXRzLXRvdXJpc3RpcXVpcXVlcy9pbWFnZXMvNTAvMTgxLzM3MjA1Mjk4LmpwZw%3D%3D/image.webp',
  10: 'https://api.cloudly.space/resize/cropratio/640/640/75/aHR0cHM6Ly9zdGF0aWMuYXBpZGFlLXRvdXJpc21lLmNvbS9maWxlc3RvcmUvb2JqZXRzLXRvdXJpc3RpcXVpcXVlcy9pbWFnZXMvNTAvMTgxLzM3MjA1Mjk4LmpwZw%3D%3D/image.webp',
  11: 'https://api.cloudly.space/resize/cropratio/640/640/75/aHR0cHM6Ly9zdGF0aWMuYXBpZGFlLXRvdXJpc21lLmNvbS9maWxlc3RvcmUvb2JqZXRzLXRvdXJpc3RpcXVpcXVpcXVlcy9pbWFnZXMvNTAvMTgxLzM3MjA1Mjk4LmpwZw%3D%3D/image.webp',
  12: 'https://www.iledere.com/app/uploads/iledere/2024/08/thumbs/port-vue-aerienne-fortification-saint-martin-ile-de-re-jules-serrurier-1920x480.webp',
  13: 'https://www.iledere.com/app/uploads/iledere/2024/08/thumbs/port-vue-aerienne-fortification-saint-martin-ile-de-re-jules-serrurier-1920x480.webp',
  14: 'https://www.iledere.com/app/uploads/iledere/2024/07/thumbs/eglise-saint-martin-ile-de-re-jules-serrurier-640x320.webp',
  15: 'https://www.iledere.com/app/uploads/iledere/2024/08/thumbs/port-vue-aerienne-fortification-saint-martin-ile-de-re-jules-serrurier-1920x480.webp',
  16: 'https://www.iledere.com/app/uploads/iledere/2024/08/thumbs/port-vue-aerienne-fortification-saint-martin-ile-de-re-jules-serrurier-1920x480.webp'
}

const photoSecours = photosEtapes[1]

// --------------------------------------------------
// HTML DE L'APPLICATION
// --------------------------------------------------

app.innerHTML = `
<main class="application">
  <header class="entete">
    <div class="logo-marque">
      <span class="logo-symbole">RP</span>
      <div><div class="logo">RALLYE VÉLO POSITIVE</div><div class="logo-baseline">L'ÎLE DE RÉ À VÉLO</div></div>
    </div>
  </header>

  <section class="hero" id="accueil">
    <div class="hero-contenu">
      <span class="etiquette">UNE AVENTURE À PARTAGER</span>
      <h1>Et si vous découvriez<br>l'Île de Ré autrement ?</h1>
      <p>Enfourchez vos vélos, ouvrez l'œil et partez à la découverte des trésors de l'île. 16 étapes, des énigmes et de beaux souvenirs à partager.</p>
      <button id="decouvrir" class="bouton-principal">Découvrir l'aventure <span>→</span></button>
      <div class="hero-infos"><span>16 étapes</span><span>48 heures</span><span>1 à 5 personnes</span></div>
      <button id="ouvrir-administration" class="bouton-secondaire">Administration</button>
    </div>
  </section>

  <section class="presentation" id="presentation">
    <p class="surtitre">L'AVENTURE COMMENCE ICI</p>
    <h2>Bien plus qu'une balade à vélo</h2>
    <p>Explorez les villages, les marais, les ports et les paysages de l'Île de Ré. À chaque étape, un indice vous attend.</p>
    <div class="cartes-avantages">
      <article class="carte"><span class="numero-carte">01</span><h3>Explorer</h3><p>Découvrez les lieux emblématiques et les petits trésors de l'île.</p></article>
      <article class="carte"><span class="numero-carte">02</span><h3>Résoudre</h3><p>Observez, réfléchissez et trouvez les réponses aux énigmes.</p></article>
      <article class="carte"><span class="numero-carte">03</span><h3>Partager</h3><p>Vivez une aventure originale et créez des souvenirs ensemble.</p></article>
    </div>
  </section>

  <section id="creation" class="panneau" hidden>
    <button class="bouton-retour" id="retour-accueil">← Retour à l'accueil</button>
    <p class="surtitre">VOTRE AVENTURE</p><h2>Créons votre équipe</h2>
    <p>Choisissez votre nom et indiquez le nombre de participants.</p>
    <form id="form-equipe">
      <label for="nom-equipe">Nom de votre équipe</label>
      <input id="nom-equipe" type="text" minlength="2" maxlength="60" placeholder="Exemple : Les Aventuriers" required>
      <label for="nombre-personnes">Nombre de participants</label>
      <select id="nombre-personnes">
        <option value="1">1 personne</option><option value="2">2 personnes</option>
        <option value="3">3 personnes</option><option value="4">4 personnes</option>
        <option value="5">5 personnes</option>
      </select>
      <div class="prix-equipe"><span>Votre aventure</span><strong>17 €</strong><small>Par équipe · Jusqu'à 5 personnes</small></div>
      <button type="submit" class="bouton-principal">Continuer <span>→</span></button>
    </form>
    <p id="message-creation" role="status"></p>
    <div class="separateur-equipe">OU</div>
    <button id="ouvrir-code" class="bouton-secondaire">J'ai déjà un code équipe</button>
  </section>

  <section id="rejoindre" class="panneau" hidden>
    <button class="bouton-retour" id="retour-creation">← Retour</button>
    <p class="surtitre">BIENVENUE DANS L'AVENTURE</p><h2>Rejoindre une équipe</h2>
    <p>Saisissez le code reçu pour retrouver votre aventure.</p>
    <form id="form-code">
      <label for="code-equipe">Votre code équipe</label>
      <input id="code-equipe" class="code-equipe" type="text" maxlength="6" minlength="6" placeholder="EX : A7K9P2" autocomplete="off" required>
      <button type="submit" class="bouton-principal">Valider mon code <span>→</span></button>
    </form>
    <p id="message-code" role="status"></p>
  </section>

  <section id="bienvenue" class="panneau panneau-bienvenue" hidden>
    <p class="surtitre">RALLYE VÉLO POSITIVE · ÎLE DE RÉ</p>
    <h2 id="titre-bienvenue">Bonjour !</h2>
    <div id="bloc-code-equipe" class="prix-equipe" hidden>
      <span>Votre paiement est confirmé</span>
      <small>Voici votre code d'accès à conserver :</small>
      <strong id="code-equipe-affiche" style="font-size:1.8rem;letter-spacing:0.18em;"></strong>
      <button type="button" id="copier-code-equipe" class="bouton-secondaire">Copier mon code</button>
      <small id="message-copie-code" role="status">Vous pourrez utiliser ce code pour retrouver votre aventure.</small>
    </div>
    <p class="texte-bienvenue">Toute l'équipe vous souhaite une très belle aventure ! Ouvrez l'œil, amusez-vous et profitez du parcours.</p>
    <div class="separateur-bienvenue"></div><h3>Avant de prendre la route...</h3>
    <p class="intro-securite">Quelques règles essentielles pour profiter pleinement de votre rallye en toute sécurité.</p>
    <div class="regle-securite"><span class="numero-regle">01</span><div><strong>Casque et équipement</strong><p>Portez un casque adapté, vérifiez vos freins, vos pneus et votre éclairage avant de partir.</p></div></div>
    <div class="regle-securite"><span class="numero-regle">02</span><div><strong>Respectez le code de la route</strong><p>Respectez les panneaux, les priorités et les pistes cyclables. Signalez vos changements de direction.</p></div></div>
    <div class="regle-securite"><span class="numero-regle">03</span><div><strong>Restez vigilants</strong><p>Gardez vos distances, adaptez votre vitesse et ne consultez pas votre téléphone en roulant.</p></div></div>
    <div class="regle-securite"><span class="numero-regle">04</span><div><strong>Respectez les autres</strong><p>Piétons, familles, autres cyclistes : partagez les chemins avec courtoisie et prudence.</p></div></div>
    <div class="regle-securite"><span class="numero-regle">05</span><div><strong>Protégez l'Île de Ré</strong><p>Respectez les espaces naturels, les marais et la faune. Restez sur les chemins autorisés et ne laissez aucun déchet derrière vous.</p></div></div>
    <div class="regle-securite"><span class="numero-regle">06</span><div><strong>Faites des pauses</strong><p>Hydratez-vous régulièrement et arrêtez-vous dans un endroit sûr pour résoudre les énigmes.</p></div></div>
    <div class="rappel-securite"><strong>Un dernier conseil</strong><p>La sécurité passe avant le jeu. Ne consultez jamais votre téléphone en roulant. Arrêtez-vous dans un endroit sûr avant chaque interaction.</p></div>
    <div class="bloc-localisation">
      <h3>Activez la localisation de votre téléphone</h3>
      <p>Elle permettra de vérifier votre arrivée à chaque lieu et de débloquer l'étape à moins de 60 mètres.</p>
      <button type="button" id="activer-localisation" class="bouton-secondaire">Activer ma localisation</button>
      <p id="message-localisation" role="status">Autorisez l'accès à votre position lorsque votre téléphone le demande.</p>
    </div>
    <label class="acceptation-securite"><input type="checkbox" id="accepter-securite"><span>J'ai lu et j'accepte les consignes de sécurité.</span></label>
    <p id="message-securite" role="status"></p>
    <button id="commencer-rallye" class="bouton-principal" disabled>Commencer le rallye <span>→</span></button>
  </section>

  <section id="ecran-etape" class="panneau panneau-etape" hidden>
    <button id="retour-accueil-etape" class="bouton-retour">← Quitter l'étape</button>
    <p id="equipe-bienvenue" class="surtitre"></p>
    <div class="progression"><span>VOTRE PARCOURS</span><strong id="compteur-etape"></strong></div>
    <div class="barre-progression"><div id="barre-etape"></div></div>
    <span id="numero-etape" class="numero-etape"></span>
    <h2 id="titre-etape"></h2><p id="intro-etape"></p>
    <div class="lieu-etape"><span id="picto-etape" class="lieu-picto"></span><div><strong id="libelle-lieu">Votre destination</strong><p id="nom-lieu"></p></div></div>
    <div id="carte-rallye" class="carte-rallye">
  <p>Chargement de la carte du Rallye Vélo Positive...</p>
</div>
    <div id="carte-rallye" class="carte-rallye">
  <p>Chargement de la carte du Rallye Vélo Positive...</p>
</div>
    <div id="attente-gps" class="consigne-etape">
      <strong>Étape encore verrouillée</strong>
      <p>Rejoignez ce lieu à vélo. L'énigme se débloquera lorsque vous serez à moins de 60 mètres.</p>
      <p id="message-gps" role="status" aria-live="polite">En attente de votre position GPS...</p>
      <p id="distance-gps"></p>
    </div>
    <div id="contenu-enigme" class="bloc-enigme" hidden>
      <p class="surtitre">VOTRE DÉFI</p><h3 id="titre-defi">À vous de jouer !</h3>
      <p id="texte-enigme"></p>
      <form id="form-reponse-etape">
        <label for="reponse-etape">Votre réponse</label>
        <input id="reponse-etape" type="text" placeholder="Écrivez votre réponse ici..." autocomplete="off">
        <button type="submit" class="bouton-principal" id="valider-reponse">Valider ma réponse <span>→</span></button>
      </form>
      <div id="zone-photo" hidden>
        <label for="photo-equipe">Votre photo souvenir</label>
        <input id="photo-equipe" type="file" accept="image/*" capture="environment">
        <img id="apercu-photo" alt="Aperçu de votre photo" hidden>
      </div>
      <p id="message-reponse" role="status"></p>
      <p id="indice-etape" class="indice" hidden></p>
      <button id="etape-suivante" class="bouton-principal" hidden>Continuer vers la prochaine étape <span>→</span></button>
    </div>
    <div id="fin-rallye" class="rappel-securite" hidden>
      <strong>Félicitations !</strong>
      <p>Vous avez terminé les 16 étapes du Rallye Vélo Positive. Merci d'avoir découvert l'Île de Ré autrement !</p>
      <button id="retour-final" class="bouton-principal">Revenir à l'accueil</button>
    </div>
  </section>

  <section id="admin-connexion" class="panneau" hidden>
    <button id="admin-retour" class="bouton-retour">← Retour à l'accueil</button>
    <p class="surtitre">ESPACE PRIVÉ</p><h2>Administration</h2>
    <p>Connectez-vous avec votre compte administrateur.</p>
    <form id="form-admin">
      <label for="admin-email">Adresse e-mail</label>
      <input id="admin-email" type="email" autocomplete="username" required>
      <label for="admin-password">Mot de passe</label>
      <input id="admin-password" type="password" autocomplete="current-password" required>
      <button type="submit" class="bouton-principal" id="admin-submit">Se connecter</button>
    </form>
    <p id="admin-message" role="status"></p>
  </section>

  <section id="admin-tableau" class="panneau" hidden>
    <div class="admin-entete">
      <div><p class="surtitre">ESPACE PRIVÉ</p><h2>Tableau de bord</h2></div>
      <button id="admin-deconnexion" class="bouton-secondaire">Déconnexion</button>
    </div>
    <p>Suivez les équipes et gérez leur progression.</p>
    <button id="actualiser-equipes" class="bouton-principal">Actualiser les équipes</button>
    <p id="admin-liste-message" role="status"></p>
    <div id="liste-equipes"></div>
  </section>

  <footer><strong>RALLYE VÉLO POSITIVE</strong><p>Une autre façon de découvrir l'Île de Ré.</p></footer>
</main>
`

// --------------------------------------------------
// ÉTAT DE L'APPLICATION
// --------------------------------------------------

const $ = selector => document.querySelector(selector)

const accueil = $('#accueil')
const presentation = $('#presentation')
const creation = $('#creation')
const rejoindre = $('#rejoindre')
const bienvenue = $('#bienvenue')
const ecranEtape = $('#ecran-etape')
const adminConnexion = $('#admin-connexion')
const adminTableau = $('#admin-tableau')

let nomEquipeActuel = ''
let codeEquipeActuel = ''
let jetonEquipe = null
let idEquipe = null
let localisationAutorisee = false
let suiviGPS = null
let etapeActuelle = 0
let etapeDebloquee = false
let photoSelectionnee = null
let positionsConsecutivesValides = 0

const PRECISION_GPS_MAX = 50
const DISTANCE_DEBLOCAGE = 60
const NOMBRE_MESURES_REQUISES = 2

// --------------------------------------------------
// OUTILS
// --------------------------------------------------

function afficherEcran(ecran) {
  ;[
    accueil, presentation, creation, rejoindre, bienvenue,
    ecranEtape, adminConnexion, adminTableau
  ].forEach(section => {
    section.hidden = true
  })

  ecran.hidden = false
  window.scrollTo(0, 0)
}

function arreterSuiviGPS() {
  if (suiviGPS !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(suiviGPS)
    suiviGPS = null
  }
}

function normaliser(texte) {
  return String(texte || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function calculerDistanceMetres(lat1, lon1, lat2, lon2) {
  const rayonTerre = 6371000
  const rad = valeur => valeur * Math.PI / 180
  const dLat = rad(lat2 - lat1)
  const dLon = rad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) *
    Math.cos(rad(lat2)) *
    Math.sin(dLon / 2) ** 2

  return rayonTerre * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function extraireResultat(data) {
  // Certaines fonctions RPC renvoient un objet, d'autres une ligne de tableau.
  return Array.isArray(data) ? data[0] : data
}

function afficherErreur(message, erreur) {
  console.error(message, erreur)
  return erreur?.message || message
}

function appliquerPhotoEtape(numeroEtape) {
  const photoPrincipale = photosEtapes[numeroEtape] || photoSecours
  const imageTest = new Image()

  imageTest.onload = () => {
    ecranEtape.style.setProperty('--photo-etape', `url("${photoPrincipale}")`)
  }

  imageTest.onerror = () => {
    const imageSecours = new Image()

    imageSecours.onload = () => {
      ecranEtape.style.setProperty('--photo-etape', `url("${photoSecours}")`)
    }

    imageSecours.onerror = () => {
      ecranEtape.style.setProperty('--photo-etape', 'none')
    }

    imageSecours.src = photoSecours
  }

  imageTest.src = photoPrincipale
}

// --------------------------------------------------
// PAIEMENT SUMUP
// --------------------------------------------------

$('#form-equipe').addEventListener('submit', async event => {
  event.preventDefault()

  const nom = $('#nom-equipe').value.trim()
  const nombre = Number($('#nombre-personnes').value)
  const bouton = $('#form-equipe button[type="submit"]')
  const message = $('#message-creation')

  if (nom.length < 2) {
    message.textContent = 'Le nom de votre équipe doit contenir au moins 2 caractères.'
    return
  }

  if (!Number.isInteger(nombre) || nombre < 1 || nombre > 5) {
    message.textContent = 'Choisissez entre 1 et 5 participants.'
    return
  }

  bouton.disabled = true
  bouton.textContent = 'Préparation du paiement...'
  message.textContent = 'Nous préparons votre aventure. Merci de patienter.'

  try {
    const { data, error } = await supabase.functions.invoke(
      'creer-paiement-equipe',
      {
        body: {
          nom_equipe: nom,
          nombre_personnes: nombre,
          url_retour: window.location.origin
        }
      }
    )

    if (error) {
      throw new Error(
        error.message || 'La connexion au service de paiement a échoué.'
      )
    }

    if (!data?.succes || !data?.paiement_url) {
      throw new Error(
        data?.erreur || 'Le lien de paiement SumUp est introuvable.'
      )
    }

    message.textContent = 'Redirection vers le paiement sécurisé...'
    window.location.href = data.paiement_url

  } catch (erreur) {
    message.textContent = afficherErreur(
      'Erreur lors de la création du paiement.',
      erreur
    )

    bouton.disabled = false
    bouton.innerHTML = 'Continuer <span>→</span>'
  }
})

// --------------------------------------------------
// RETOUR DE PAIEMENT
// --------------------------------------------------

async function verifierRetourPaiement() {
  const params = new URLSearchParams(window.location.search)
  const reference = params.get('reference')

  if (!reference) return

  afficherEcran(creation)
  $('#message-creation').textContent =
    'Vérification de votre paiement. Merci de patienter...'

  try {
    const { data, error } = await supabase.functions.invoke(
      'recuperer-code-equipe',
      {
        body: { reference }
      }
    )

    if (error) {
      throw new Error(error.message || 'Impossible de vérifier le paiement.')
    }

    if (!data?.succes || !data?.code_equipe) {
      throw new Error(
        data?.erreur ||
        'Le paiement n’est pas encore confirmé. Patientez quelques instants puis réessayez.'
      )
    }

    $('#message-creation').textContent =
      `Paiement confirmé ! Votre code équipe est : ${data.code_equipe}. Vous allez accéder à votre aventure.`

    $('#code-equipe').value = data.code_equipe

    // Le code reçu après paiement est immédiatement vérifié par Supabase.
    await verifierCodeEquipe(data.code_equipe)

    // Retire la référence de paiement de l'adresse du navigateur.
    window.history.replaceState({}, document.title, window.location.pathname)

  } catch (erreur) {
    $('#message-creation').textContent = afficherErreur(
      'La vérification du paiement a échoué.',
      erreur
    )
  }
}

// --------------------------------------------------
// VÉRIFICATION DU CODE ÉQUIPE
// --------------------------------------------------

async function verifierCodeEquipe(code) {
  const message = $('#message-code')
  message.textContent = 'Vérification de votre code...'

  try {
    const { data, error } = await supabase.rpc(
      'verifier_code_equipe',
      { p_code: code }
    )

    if (error) {
      throw new Error(error.message)
    }

    const resultat = extraireResultat(data)

    if (!resultat?.succes || !resultat?.jeton) {
      throw new Error(
        resultat?.message ||
        resultat?.erreur ||
        'Ce code est invalide, inactif ou expiré.'
      )
    }

    jetonEquipe = resultat.jeton
    codeEquipeActuel = String(code || '').toUpperCase()
    idEquipe = resultat.equipe_id || null
    nomEquipeActuel = resultat.nom_equipe || 'Votre équipe'

    const etapeServeur = Number(resultat.etape_actuelle || 1)
    etapeActuelle = Math.max(0, Math.min(15, etapeServeur - 1))

    ouvrirBienvenue(nomEquipeActuel)

  } catch (erreur) {
    message.textContent = afficherErreur(
      'Impossible de vérifier le code équipe.',
      erreur
    )
    throw erreur
  }
}

$('#code-equipe').addEventListener('input', event => {
  event.target.value = event.target.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
})

$('#form-code').addEventListener('submit', async event => {
  event.preventDefault()

  const code = $('#code-equipe').value.trim().toUpperCase()

  if (code.length !== 6) {
    $('#message-code').textContent = 'Votre code doit contenir 6 caractères.'
    return
  }

  const bouton = $('#form-code button[type="submit"]')
  bouton.disabled = true
  bouton.textContent = 'Vérification...'

  try {
    await verifierCodeEquipe(code)
  } catch {
    // Le message d'erreur est déjà affiché dans verifierCodeEquipe.
  } finally {
    bouton.disabled = false
    bouton.innerHTML = 'Valider mon code <span>→</span>'
  }
})

// --------------------------------------------------
// ACCUEIL ET ÉCRANS
// --------------------------------------------------

$('#decouvrir').addEventListener('click', () => {
  afficherEcran(creation)
})

$('#retour-accueil').addEventListener('click', () => {
  arreterSuiviGPS()
  afficherEcran(accueil)
  presentation.hidden = false
})

$('#ouvrir-code').addEventListener('click', () => {
  $('#message-code').textContent = ''
  afficherEcran(rejoindre)
})

$('#retour-creation').addEventListener('click', () => {
  afficherEcran(creation)
})

function ouvrirBienvenue(nom) {
  nomEquipeActuel = nom || 'Votre équipe'

  $('#titre-bienvenue').textContent = `Bonjour ${nomEquipeActuel} !`
  $('#code-equipe-affiche').textContent = codeEquipeActuel
  $('#bloc-code-equipe').hidden = !codeEquipeActuel
  $('#message-copie-code').textContent =
    'Vous pourrez utiliser ce code pour retrouver votre aventure.'
  $('#accepter-securite').checked = false
  $('#commencer-rallye').disabled = true
  $('#message-securite').textContent = ''

  $('#message-localisation').textContent = localisationAutorisee
    ? 'La localisation a déjà été autorisée sur cet appareil.'
    : 'Autorisez l’accès à votre position lorsque votre téléphone le demande.'

  $('#activer-localisation').disabled = false
  $('#activer-localisation').textContent = localisationAutorisee
    ? 'Localisation activée'
    : 'Activer ma localisation'

  afficherEcran(bienvenue)
}

$('#copier-code-equipe').addEventListener('click', async () => {
  const message = $('#message-copie-code')

  try {
    await navigator.clipboard.writeText(codeEquipeActuel)
    message.textContent = 'Code copié. Vous pouvez le conserver dans vos notes.'
  } catch {
    message.textContent = `Votre code : ${codeEquipeActuel}. Vous pouvez le sélectionner et le copier.`
  }
})

// --------------------------------------------------
// LOCALISATION
// --------------------------------------------------

$('#activer-localisation').addEventListener('click', () => {
  const message = $('#message-localisation')

  if (!navigator.geolocation) {
    message.textContent = 'La localisation n’est pas disponible sur ce navigateur.'
    return
  }

  $('#activer-localisation').disabled = true
  $('#activer-localisation').textContent = 'Activation en cours...'

  navigator.geolocation.getCurrentPosition(
    () => {
      localisationAutorisee = true
      $('#activer-localisation').disabled = false
      $('#activer-localisation').textContent = 'Localisation activée'
      message.textContent =
        'Parfait ! Votre téléphone autorise maintenant l’accès à votre position.'
    },
    erreur => {
      $('#activer-localisation').disabled = false
      $('#activer-localisation').textContent = 'Réessayer'

      message.textContent = erreur.code === 1
        ? 'Accès refusé. Activez la localisation dans les réglages du téléphone ou du navigateur.'
        : 'Position non déterminée. Vérifiez le GPS et réessayez à l’extérieur.'
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  )
})

$('#accepter-securite').addEventListener('change', event => {
  $('#commencer-rallye').disabled = !event.target.checked
})

$('#commencer-rallye').addEventListener('click', () => {
  if (!jetonEquipe) {
    $('#message-securite').textContent =
      'Votre équipe doit d’abord être vérifiée avec son code.'
    return
  }

  afficherEtape(etapeActuelle)
})

// --------------------------------------------------
// GESTION DES ÉTAPES ET GPS
// --------------------------------------------------

function afficherEtape(index) {
  arreterSuiviGPS()

  etapeActuelle = index
  etapeDebloquee = false
  photoSelectionnee = null
  positionsConsecutivesValides = 0

  const stage = stages[index]

  if (!stage) return

  $('#equipe-bienvenue').textContent =
    `BIENVENUE ${nomEquipeActuel.toUpperCase()}`

  $('#compteur-etape').textContent = `${stage.number} / 16`
  $('#barre-etape').style.width = `${stage.number / 16 * 100}%`
  $('#numero-etape').textContent =
    `ÉTAPE ${String(stage.number).padStart(2, '0')}`

  $('#titre-etape').textContent = stage.title
  $('#intro-etape').textContent = stage.intro
  $('#picto-etape').textContent = String(stage.number).padStart(2, '0')
  $('#nom-lieu').textContent = stage.name
  $('#libelle-lieu').textContent =
    stage.finish ? 'Point d’arrivée' : 'Votre prochaine étape'

  $('#message-gps').textContent = 'Recherche de votre position GPS...'
  $('#distance-gps').textContent = ''
  $('#attente-gps').hidden = true
  $('#contenu-enigme').hidden = true
  $('#fin-rallye').hidden = true

  $('#message-reponse').textContent = ''
  $('#indice-etape').hidden = true
  $('#indice-etape').textContent = ''
  $('#etape-suivante').hidden = true

  $('#form-reponse-etape').hidden = false
  $('#reponse-etape').value = ''
  $('#reponse-etape').disabled = false
  $('#valider-reponse').disabled = false

  $('#zone-photo').hidden = !stage.photo
  $('#photo-equipe').value = ''
  $('#apercu-photo').hidden = true
  $('#apercu-photo').removeAttribute('src')

  $('#texte-enigme').textContent = stage.riddle
  $('#titre-defi').textContent = stage.photo
    ? 'Le défi photo'
    : (stage.finish ? 'Le mot de la fin' : 'Observez et réfléchissez !')

  $('#form-reponse-etape').querySelector('label').textContent =
    stage.photo
      ? 'Votre photo souvenir'
      : 'Votre réponse'

  $('#reponse-etape').required = !stage.photo
  $('#reponse-etape').placeholder = stage.photo
    ? 'Votre photo sera envoyée pour valider l’étape'
    : 'Écrivez votre réponse ici...'

  appliquerPhotoEtape(stage.number)
  afficherEcran(ecranEtape)
  initialiserCarteRallye()
  if (index === 0) {
    debloquerEtape()
  } else {
    demarrerSuiviGPS()
  }
}

function debloquerEtape() {
  if (etapeDebloquee) return

  etapeDebloquee = true
  $('#attente-gps').hidden = true
  $('#contenu-enigme').hidden = false
  $('#message-reponse').textContent =
    'Vous êtes au bon endroit. Le défi est débloqué !'
  $('#message-reponse').style.color = '#174D36'

  arreterSuiviGPS()
}

function demarrerSuiviGPS() {
  const stage = stages[etapeActuelle]

  if (!navigator.geolocation) {
    $('#message-gps').textContent =
      'La localisation GPS n’est pas disponible sur ce navigateur.'
    $('#attente-gps').hidden = false
    return
  }

  $('#attente-gps').hidden = false
  $('#message-gps').textContent = 'Recherche de votre position GPS...'

  suiviGPS = navigator.geolocation.watchPosition(
    position => {
      localisationAutorisee = true

      const { latitude, longitude, accuracy } = position.coords

      const distance = calculerDistanceMetres(
        latitude,
        longitude,
        stage.lat,
        stage.lon
      )

      $('#distance-gps').textContent =
        `Distance restante : environ ${Math.round(distance)} mètres. Précision GPS : environ ${Math.round(accuracy)} mètres.`

      if (accuracy > PRECISION_GPS_MAX) {
        positionsConsecutivesValides = 0
        $('#message-gps').textContent =
          `GPS trop imprécis pour le moment (${Math.round(accuracy)} m). Attendez quelques instants dans un endroit dégagé.`
        return
      }

      if (distance <= DISTANCE_DEBLOCAGE) {
        positionsConsecutivesValides++

        if (positionsConsecutivesValides >= NOMBRE_MESURES_REQUISES) {
          $('#message-gps').textContent =
            'Vous êtes arrivé à proximité de cette étape.'
          debloquerEtape()
        } else {
          $('#message-gps').textContent =
            'Position confirmée. Vérification en cours...'
        }
      } else {
        positionsConsecutivesValides = 0
        $('#message-gps').textContent =
          'Continuez jusqu’au point indiqué. Le défi se débloquera automatiquement.'
      }
    },
    erreur => {
      const messages = {
        1: 'Accès GPS refusé. Autorisez la localisation dans les réglages de votre téléphone.',
        2: 'Votre position est momentanément indisponible. Essayez à nouveau à l’extérieur.',
        3: 'Le GPS met trop de temps à répondre. Patientez ou réessayez.'
      }

      $('#message-gps').textContent =
        messages[erreur.code] ||
        'Impossible de récupérer votre position. Vérifiez les réglages GPS.'
    },
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    }
  )
}

// --------------------------------------------------
// PHOTOS DES ÉTAPES 7 ET 15
// --------------------------------------------------

$('#photo-equipe').addEventListener('change', event => {
  const fichier = event.target.files?.[0]

  if (!fichier) {
    photoSelectionnee = null
    return
  }

  if (!fichier.type.startsWith('image/')) {
    $('#message-reponse').textContent =
      'Veuillez sélectionner une image.'
    event.target.value = ''
    return
  }

  if (fichier.size > 10 * 1024 * 1024) {
    $('#message-reponse').textContent =
      'La photo est trop volumineuse. Choisissez une image de moins de 10 Mo.'
    event.target.value = ''
    return
  }

  photoSelectionnee = fichier

  const ancienneUrl = $('#apercu-photo').src
  if (ancienneUrl.startsWith('blob:')) {
    URL.revokeObjectURL(ancienneUrl)
  }

  $('#apercu-photo').src = URL.createObjectURL(fichier)
  $('#apercu-photo').hidden = false
  $('#message-reponse').textContent =
    'Photo sélectionnée. Vous pouvez maintenant valider cette étape.'
})

async function envoyerPhotoEtape(stage) {
  if (!photoSelectionnee) {
    throw new Error('Choisissez d’abord une photo prise sur place.')
  }

  if (!jetonEquipe) {
    throw new Error('Votre session équipe a expiré. Saisissez à nouveau votre code.')
  }

  const formulaire = new FormData()
  formulaire.append('jeton', jetonEquipe)
  formulaire.append('etape', String(stage.number))
  formulaire.append('fichier', photoSelectionnee)

  const { data, error } = await supabase.functions.invoke(
    'deposer-photo-equipe',
    { body: formulaire }
  )

  if (error) {
    throw new Error(error.message || 'L’envoi de la photo a échoué.')
  }

  if (!data?.succes) {
    throw new Error(
      data?.erreur ||
      data?.message ||
      'La photo n’a pas pu être enregistrée.'
    )
  }

  return data
}

// --------------------------------------------------
// VALIDATION DES RÉPONSES PAR SUPABASE
// --------------------------------------------------

$('#form-reponse-etape').addEventListener('submit', async event => {
  event.preventDefault()

  if (!etapeDebloquee) return

  const stage = stages[etapeActuelle]
  const bouton = $('#valider-reponse')
  const message = $('#message-reponse')
  const reponse = $('#reponse-etape').value.trim()

  if (!jetonEquipe) {
    message.textContent =
      'Votre session équipe n’est plus active. Saisissez à nouveau votre code.'
    message.style.color = '#A33A32'
    return
  }

  bouton.disabled = true
  bouton.textContent = stage.photo
    ? 'Envoi de la photo...'
    : 'Vérification de la réponse...'

  message.textContent = 'Validation en cours...'
  message.style.color = '#174D36'

  try {
    if (stage.photo) {
      await envoyerPhotoEtape(stage)
    } else {
      if (!reponse) {
        throw new Error('Écrivez votre réponse avant de continuer.')
      }

      const { data, error } = await supabase.rpc(
        'verifier_reponse_equipe',
        {
          p_jeton: jetonEquipe,
          p_etape: stage.number,
          p_reponse: reponse
        }
      )

      if (error) {
        throw new Error(error.message)
      }

      const resultat = extraireResultat(data)

      if (!resultat?.succes) {
        throw new Error(
          resultat?.message ||
          resultat?.erreur ||
          'Cette réponse n’a pas été acceptée. Réessayez.'
        )
      }
    }

    message.textContent = stage.finish
      ? 'Bravo ! Votre rallye est terminé.'
      : 'Bravo ! Cette étape est validée.'

    message.style.color = '#174D36'
    $('#form-reponse-etape').hidden = true
    $('#indice-etape').hidden = true

    if (stage.finish) {
      $('#fin-rallye').hidden = false
    } else {
      $('#etape-suivante').hidden = false
      $('#etape-suivante').textContent =
        `Continuer vers l’étape ${stage.number + 1} →`
    }

  } catch (erreur) {
    message.textContent = afficherErreur(
      'La validation a échoué.',
      erreur
    )
    message.style.color = '#A33A32'

    if (stage.hint) {
      $('#indice-etape').textContent = `Indice : ${stage.hint}`
      $('#indice-etape').hidden = false
    }

  } finally {
    bouton.disabled = false
    bouton.innerHTML = 'Valider ma réponse <span>→</span>'
  }
})

$('#etape-suivante').addEventListener('click', () => {
  if (etapeActuelle < stages.length - 1) {
    afficherEtape(etapeActuelle + 1)
  }
})

$('#retour-accueil-etape').addEventListener('click', () => {
  arreterSuiviGPS()
  afficherEcran(accueil)
  presentation.hidden = false
})

$('#retour-final').addEventListener('click', () => {
  arreterSuiviGPS()
  jetonEquipe = null
  idEquipe = null
  nomEquipeActuel = ''
  afficherEcran(accueil)
  presentation.hidden = false
})

// --------------------------------------------------
// ADMINISTRATION
// --------------------------------------------------

$('#ouvrir-administration').addEventListener('click', async () => {
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    const { data: admin } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (admin) {
      afficherEcran(adminTableau)
      await chargerEquipes()
      return
    }

    await supabase.auth.signOut()
  }

  $('#admin-message').textContent = ''
  $('#admin-password').value = ''
  afficherEcran(adminConnexion)
})

$('#admin-retour').addEventListener('click', () => {
  afficherEcran(accueil)
  presentation.hidden = false
})

$('#form-admin').addEventListener('submit', async event => {
  event.preventDefault()

  const bouton = $('#admin-submit')
  const message = $('#admin-message')

  bouton.disabled = true
  bouton.textContent = 'Connexion...'
  message.textContent = ''

  const email = $('#admin-email').value.trim()
  const password = $('#admin-password').value

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle()

    if (adminError || !admin) {
      await supabase.auth.signOut()
      throw new Error('Ce compte ne possède pas les droits administrateur.')
    }

    afficherEcran(adminTableau)
    await chargerEquipes()

  } catch (erreur) {
    message.textContent = afficherErreur(
      'Connexion impossible.',
      erreur
    )
  } finally {
    bouton.disabled = false
    bouton.textContent = 'Se connecter'
  }
})

async function chargerEquipes() {
  const liste = $('#liste-equipes')
  const message = $('#admin-liste-message')

  liste.innerHTML = ''
  message.textContent = 'Chargement des équipes...'

  const { data: equipes, error } = await supabase
    .from('equipes')
    .select('id, nom_equipe, etape_actuelle, code_active, paiement_valide, date_expiration')
    .order('nom_equipe', { ascending: true })

  if (error) {
    message.textContent =
      `Impossible de charger les équipes : ${error.message}`
    return
  }

  if (!equipes || equipes.length === 0) {
    message.textContent =
      'Aucune équipe enregistrée pour le moment.'
    return
  }

  message.textContent =
    `${equipes.length} équipe(s) enregistrée(s).`

  equipes.forEach(equipe => {
    const carte = document.createElement('article')
    carte.className = 'carte admin-carte'

    const titre = document.createElement('h3')
    titre.textContent = equipe.nom_equipe || 'Équipe sans nom'

    const progression = document.createElement('p')
    progression.textContent =
      `Progression : étape ${equipe.etape_actuelle || 1} / 16`

    const paiement = document.createElement('p')
    paiement.textContent =
      `Paiement : ${equipe.paiement_valide ? 'validé' : 'non validé'}`

    const code = document.createElement('p')
    code.textContent =
      `Code actif : ${equipe.code_active ? 'oui' : 'non'}`

    const expiration = document.createElement('p')
    expiration.textContent = equipe.date_expiration
      ? `Expiration : ${new Date(equipe.date_expiration).toLocaleString('fr-FR')}`
      : 'Expiration : non renseignée'

    const actions = document.createElement('div')
    actions.className = 'admin-actions'

    const avancer = document.createElement('button')
    avancer.className = 'bouton-principal'
    avancer.textContent = 'Débloquer l’étape suivante'
    avancer.disabled = Number(equipe.etape_actuelle) >= 16
    avancer.addEventListener('click', () => {
      modifierProgression(
        equipe,
        Math.min(16, Number(equipe.etape_actuelle || 1) + 1)
      )
    })

    const retour = document.createElement('button')
    retour.className = 'bouton-secondaire'
    retour.textContent = 'Réinitialiser à l’étape 1'
    retour.addEventListener('click', () => {
      if (confirm(`Réinitialiser la progression de ${equipe.nom_equipe} ?`)) {
        modifierProgression(equipe, 1)
      }
    })

    const prolonger = document.createElement('button')
    prolonger.className = 'bouton-secondaire'
    prolonger.textContent = 'Prolonger de 48 heures'
    prolonger.addEventListener('click', () => {
      prolongerAccesEquipe(equipe)
    })

    const galerie = document.createElement('button')
    galerie.className = 'bouton-secondaire'
    galerie.textContent = 'Voir les photos'
    galerie.addEventListener('click', () => {
      afficherPhotosEquipe(equipe, carte)
    })

    actions.append(avancer, retour, prolonger, galerie)

    const zonePhotos = document.createElement('div')
    zonePhotos.className = 'galerie-photos-equipe'
    zonePhotos.hidden = true

    carte.append(
      titre,
      progression,
      paiement,
      code,
      expiration,
      actions,
      zonePhotos
    )

    liste.appendChild(carte)
  })
}

async function modifierProgression(equipe, nouvelleEtape) {
  $('#admin-liste-message').textContent = 'Mise à jour en cours...'

  const { error } = await supabase
    .from('equipes')
    .update({ etape_actuelle: nouvelleEtape })
    .eq('id', equipe.id)

  if (error) {
    $('#admin-liste-message').textContent =
      `La mise à jour a échoué : ${error.message}`
    return
  }

  $('#admin-liste-message').textContent =
    `Progression de ${equipe.nom_equipe} mise à jour : étape ${nouvelleEtape}.`

  await chargerEquipes()
}

async function prolongerAccesEquipe(equipe) {
  const message = $('#admin-liste-message')
  const maintenant = new Date()

  const expirationActuelle = equipe.date_expiration
    ? new Date(equipe.date_expiration)
    : maintenant

  const pointDeDepart = expirationActuelle > maintenant
    ? expirationActuelle
    : maintenant

  const nouvelleExpiration = new Date(
    pointDeDepart.getTime() + 48 * 60 * 60 * 1000
  )

  const confirmation = confirm(
    `Prolonger l'accès de "${equipe.nom_equipe}" de 48 heures ?\n\nNouvelle expiration : ${nouvelleExpiration.toLocaleString('fr-FR')}`
  )

  if (!confirmation) return

  message.textContent = 'Prolongation en cours...'

  const { error } = await supabase
    .from('equipes')
    .update({
      date_expiration: nouvelleExpiration.toISOString()
    })
    .eq('id', equipe.id)

  if (error) {
    message.textContent =
      `Impossible de prolonger l'accès : ${error.message}`
    return
  }

  message.textContent =
    `L'accès de ${equipe.nom_equipe} est prolongé jusqu'au ${nouvelleExpiration.toLocaleString('fr-FR')}.`

  await chargerEquipes()
}

async function afficherPhotosEquipe(equipe, carte) {
  const zone = carte.querySelector('.galerie-photos-equipe')

  if (!zone.hidden) {
    zone.hidden = true
    return
  }

  zone.hidden = false
  zone.innerHTML = '<p>Chargement des photos...</p>'

  const { data: photos, error } = await supabase
    .from('photos')
    .select('id, equipe_id, etape_id, chemin_fichier, created_at')
    .eq('equipe_id', equipe.id)
    .in('etape_id', [7, 15])
    .order('created_at', { ascending: true })

  if (error) {
    zone.textContent =
      `Impossible de récupérer les photos : ${error.message}`
    return
  }

  if (!photos || photos.length === 0) {
    zone.textContent =
      'Aucune photo enregistrée pour les étapes 7 et 15.'
    return
  }

  zone.innerHTML = ''

  const titreGalerie = document.createElement('h4')
  titreGalerie.textContent = 'Photos souvenirs de l’équipe'
  zone.appendChild(titreGalerie)

  for (const photo of photos) {
    const { data: lien, error: erreurLien } = await supabase
      .storage
      .from('photos-equipes')
      .createSignedUrl(photo.chemin_fichier, 3600)

    const bloc = document.createElement('div')
    bloc.className = 'photo-admin'

    const titre = document.createElement('p')
    titre.textContent = `Étape ${photo.etape_id}`

    if (erreurLien || !lien?.signedUrl) {
      const erreur = document.createElement('p')
      erreur.textContent =
        `Photo inaccessible : ${erreurLien?.message || 'lien sécurisé indisponible'}.`
      bloc.append(titre, erreur)
    } else {
      const image = document.createElement('img')
      image.src = lien.signedUrl
      image.alt =
        `Photo de l'équipe ${equipe.nom_equipe}, étape ${photo.etape_id}`
      image.loading = 'lazy'
      image.style.width = '100%'
      image.style.maxWidth = '420px'
      image.style.height = 'auto'
      image.style.borderRadius = '12px'
      image.style.display = 'block'

      const date = document.createElement('small')
      date.textContent = photo.created_at
        ? `Ajoutée le ${new Date(photo.created_at).toLocaleString('fr-FR')}`
        : ''

      bloc.append(titre, image, date)
    }

    zone.appendChild(bloc)
  }
}

$('#actualiser-equipes').addEventListener('click', chargerEquipes)

$('#admin-deconnexion').addEventListener('click', async () => {
  await supabase.auth.signOut()
  afficherEcran(accueil)
  presentation.hidden = false
})

// --------------------------------------------------
// DÉMARRAGE
// --------------------------------------------------
initialiserGestionEtapes({ supabase, stages, photosEtapes })
verifierRetourPaiement()












