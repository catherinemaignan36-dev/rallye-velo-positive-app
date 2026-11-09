
export function initialiserGestionEtapes({ supabase, stages, photosEtapes }) {
  const tableau = document.querySelector('#admin-tableau');

  if (!tableau) {
    console.error('Espace administration introuvable.');
    return;
  }

  if (document.querySelector('#gestion-etapes-rvp')) return;

  const zone = document.createElement('section');
  zone.id = 'gestion-etapes-rvp';
  zone.style.cssText = `
    margin-top: 30px;
    padding: 20px;
    background: #f5f7f5;
    border-radius: 12px;
    color: #174D36;
  `;

  zone.innerHTML = `
    <h2>Gestion des étapes</h2>
    <p>Modifie les informations des 16 étapes de ton rallye.</p>

    <button type="button" id="ouvrir-editeur-etapes"
      style="background:#174D36;color:white;border:0;padding:12px 18px;border-radius:8px;cursor:pointer;">
      Modifier les étapes
    </button>

    <div id="editeur-etapes-contenu" style="display:none;margin-top:20px;">
      <label for="choix-etape"><strong>Choisir une étape</strong></label>
      <select id="choix-etape" style="display:block;width:100%;padding:10px;margin:8px 0 18px;"></select>

      <div id="formulaire-etape">
        <p>Chargement des étapes...</p>
      </div>
    </div>

    <p id="message-etapes" role="status" style="margin-top:12px;"></p>
  `;

  tableau.appendChild(zone);

  const bouton = zone.querySelector('#ouvrir-editeur-etapes');
  const contenu = zone.querySelector('#editeur-etapes-contenu');
  const select = zone.querySelector('#choix-etape');
  const formulaire = zone.querySelector('#formulaire-etape');
  const message = zone.querySelector('#message-etapes');

  let listeEtapes = [];
  let listeSolutions = [];

  function securiser(texte) {
    return String(texte ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  bouton.addEventListener('click', async () => {
    const ouvert = contenu.style.display !== 'none';
    contenu.style.display = ouvert ? 'none' : 'block';

    if (!ouvert && listeEtapes.length === 0) {
      await chargerEtapes();
    }
  });

  async function chargerEtapes() {
    message.textContent = 'Chargement...';

    const { data: etapes, error: erreurEtapes } = await supabase
      .from('stages')
      .select('*')
      .order('numero', { ascending: true });

    if (erreurEtapes) {
      message.textContent = 'Impossible de charger les étapes : ' + erreurEtapes.message;
      return;
    }

    const { data: solutions, error: erreurSolutions } = await supabase
      .from('solutions_etapes')
      .select('*');

    if (erreurSolutions) {
      message.textContent = 'Impossible de charger les réponses : ' + erreurSolutions.message;
      return;
    }

    listeEtapes = etapes || [];
    listeSolutions = solutions || [];

    select.innerHTML = listeEtapes.map(etape => `
      <option value="${etape.id}">
        Étape ${etape.numero} — ${securiser(etape.nom)}
      </option>
    `).join('');

    select.addEventListener('change', afficherEtape);
    afficherEtape();

    message.textContent = listeEtapes.length + ' étapes chargées.';
  }

  function afficherEtape() {
    const etape = listeEtapes.find(item => String(item.id) === select.value);

    if (!etape) {
      formulaire.innerHTML = '<p>Étape introuvable.</p>';
      return;
    }

    const solution = listeSolutions.find(
      item => Number(item.etape_id) === Number(etape.id)
    );

    const reponses = solution?.reponses_acceptees || [];

    formulaire.innerHTML = `
      <form id="form-edition-etape">
        <label><strong>Nom du lieu</strong></label>
        <input name="nom" value="${securiser(etape.nom)}" required
          style="display:block;width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">

        <label><strong>Titre de l'étape</strong></label>
        <input name="titre" value="${securiser(etape.titre)}"
          style="display:block;width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">

        <label><strong>Introduction / présentation</strong></label>
        <textarea name="introduction" rows="4"
          style="display:block;width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">${securiser(etape.introduction)}</textarea>

        <label><strong>Énigme / question</strong></label>
        <textarea name="enigme" rows="4"
          style="display:block;width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">${securiser(etape.enigme)}</textarea>

        <label><strong>Indice</strong></label>
        <textarea name="indice" rows="2"
          style="display:block;width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">${securiser(etape.indice)}</textarea>

        <label><strong>Réponse attendue</strong></label>
        <input name="reponse_attendue" value="${securiser(solution?.reponse_attendue)}"
          style="display:block;width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">

        <label><strong>Autres réponses acceptées</strong></label>
        <textarea name="reponses_acceptees" rows="3"
          placeholder="Une réponse par ligne"
          style="display:block;width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">${securiser(reponses.join('\n'))}</textarea>

        <label><strong>Photo de fond (adresse URL)</strong></label>
        <input name="photo_url" value="${securiser(etape.photo_url)}"
          placeholder="https://..."
          style="display:block;width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">

        <label><strong>Latitude</strong></label>
        <input name="latitude" type="number" step="any" value="${securiser(etape.latitude)}"
          style="display:block;width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">

        <label><strong>Longitude</strong></label>
        <input name="longitude" type="number" step="any" value="${securiser(etape.longitude)}"
          style="display:block;width:100%;padding:10px;margin:6px 0 14px;box-sizing:border-box;">

        <label style="display:flex;align-items:center;gap:8px;margin:12px 0;">
          <input name="active" type="checkbox" ${etape.active ? 'checked' : ''}>
          Étape active
        </label>

        <button type="submit"
          style="background:#174D36;color:white;border:0;padding:12px 20px;border-radius:8px;cursor:pointer;">
          Enregistrer cette étape
        </button>
      </form>
    `;

    formulaire.querySelector('#form-edition-etape')
      .addEventListener('submit', enregistrerEtape);
  }

  async function enregistrerEtape(event) {
    event.preventDefault();

    const etape = listeEtapes.find(item => String(item.id) === select.value);
    if (!etape) return;

    const form = event.currentTarget;
    const donnees = new FormData(form);

    const texte = nom => String(donnees.get(nom) ?? '').trim();
    const nombre = nom => {
      const valeur = texte(nom);
      return valeur === '' ? null : Number(valeur);
    };

    const modifications = {
      nom: texte('nom'),
      titre: texte('titre'),
      introduction: texte('introduction'),
      enigme: texte('enigme'),
      indice: texte('indice'),
      photo_url: texte('photo_url') || null,
      latitude: nombre('latitude'),
      longitude: nombre('longitude'),
      active: donnees.has('active')
    };

    message.textContent = 'Enregistrement de l’étape...';

    const { error: erreurEtape } = await supabase
      .from('stages')
      .update(modifications)
      .eq('id', etape.id);

    if (erreurEtape) {
      message.textContent = 'Erreur : ' + erreurEtape.message;
      return;
    }

    const reponseAttendue = texte('reponse_attendue');
    const reponsesAcceptees = texte('reponses_acceptees')
      .split('\n')
      .map(reponse => reponse.trim())
      .filter(Boolean);

    const solutionExistante = listeSolutions.find(
      item => Number(item.etape_id) === Number(etape.id)
    );

    const donneesSolution = {
      etape_id: etape.id,
      reponse_attendue: reponseAttendue,
      reponses_acceptees: reponsesAcceptees
    };

    let erreurSolution;

    if (solutionExistante) {
      const resultat = await supabase
        .from('solutions_etapes')
        .update(donneesSolution)
        .eq('id', solutionExistante.id);

      erreurSolution = resultat.error;
    } else if (reponseAttendue || reponsesAcceptees.length) {
      const resultat = await supabase
        .from('solutions_etapes')
        .insert(donneesSolution);

      erreurSolution = resultat.error;
    }

    if (erreurSolution) {
      message.textContent = 'Étape enregistrée, mais erreur sur les réponses : ' + erreurSolution.message;
      return;
    }

    Object.assign(etape, modifications);

    if (Array.isArray(stages)) {
      const etapeLocale = stages.find(item => Number(item.numero) === Number(etape.numero));
      if (etapeLocale) Object.assign(etapeLocale, modifications);
    }

    if (photosEtapes && modifications.photo_url) {
      photosEtapes[etape.numero] = modifications.photo_url;
    }

    if (solutionExistante) {
      Object.assign(solutionExistante, donneesSolution);
    } else if (reponseAttendue || reponsesAcceptees.length) {
      listeSolutions.push(donneesSolution);
    }

    message.textContent = 'Étape ' + etape.numero + ' enregistrée avec succès !';

    const nomEtape = select.options[select.selectedIndex];
    if (nomEtape) {
      nomEtape.textContent = 'Étape ' + etape.numero + ' — ' + etape.nom;
    }
  }
}
