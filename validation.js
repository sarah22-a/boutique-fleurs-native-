const REGEX_EMAIL = /^\S+@\S+\.\S+$/;
const REGEX_TELEPHONE = /^[0-9+ ]{8,15}$/;

export const MDP_MIN = 12; // même règle que le site

// Chaque validateur renvoie un message d'erreur, ou null si le champ est valide
export const validerNom = (nom) =>
  nom.trim() ? null : 'Le nom est obligatoire';

export const validerPrenom = (prenom) =>
  prenom.trim() ? null : 'Le prénom est obligatoire';

export const validerEmail = (email) =>
  REGEX_EMAIL.test(email.trim()) ? null : 'Email invalide';

export const validerTelephone = (telephone) =>
  !telephone || REGEX_TELEPHONE.test(telephone) ? null : 'Téléphone invalide';

export const validerMdp = (mdp) =>
  mdp.length >= MDP_MIN ? null : `${MDP_MIN} caractères minimum`;

export const validerConfirmation = (mdp, confirmation) =>
  mdp === confirmation ? null : 'Les mots de passe diffèrent';

export const validerCgu = (cgu) =>
  cgu ? null : 'Vous devez accepter les CGU';

const garderErreurs = (resultats) =>
  Object.fromEntries(
    Object.entries(resultats).filter(([, message]) => message !== null)
  );

// Un objet vide signifie que le formulaire est valide
export const validerFormulaire = (form, cgu) =>
  garderErreurs({
    nom: validerNom(form.nom),
    prenom: validerPrenom(form.prenom),
    email: validerEmail(form.email),
    telephone: validerTelephone(form.telephone),
    mdp: validerMdp(form.mdp),
    confirmation: validerConfirmation(form.mdp, form.confirmation),
    cgu: validerCgu(cgu),
  });

export const validerMdpSaisi = (mdp) =>
  mdp ? null : 'Le mot de passe est obligatoire';

export const validerFormulaireLogin = (form) =>
  garderErreurs({
    email: validerEmail(form.email),
    mdp: validerMdpSaisi(form.mdp),
  });

// ---- Produit (espace admin) ----
// "12,5" ou "12.5" -> 12.5
export const lirePrix = (texte) => Number.parseFloat(String(texte).trim().replace(',', '.'));

export const validerCategorie = (categorie) =>
  categorie.trim() ? null : 'La catégorie est obligatoire';

export const validerPrix = (texte) => {
  const prix = lirePrix(texte);
  return Number.isFinite(prix) && prix > 0 ? null : 'Prix invalide (supérieur à 0)';
};

export const validerStock = (texte) =>
  /^\d+$/.test(String(texte).trim()) ? null : 'Stock invalide (nombre entier, 0 ou plus)';

export const validerFormulaireProduit = (form) =>
  garderErreurs({
    nom: validerNom(form.nom),
    categorie: validerCategorie(form.categorie),
    prix: validerPrix(form.prix),
    stock: validerStock(form.stock),
  });

// ---- Profil ----
export const validerFormulaireProfil = (form) =>
  garderErreurs({
    nom: validerNom(form.nom),
    prenom: validerPrenom(form.prenom),
    telephone: validerTelephone(form.telephone),
  });
