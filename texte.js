// Met en minuscules et retire les accents : "Écran" devient "ecran"
export const normaliser = (texte) =>
  String(texte)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

// 39 -> "39,00 €"
export const formaterPrix = (prix) => prix.toFixed(2).replace('.', ',') + ' €';
