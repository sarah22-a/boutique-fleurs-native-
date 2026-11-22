// Textes de la fiche produit, selon la catégorie (pas de colonne en plus dans la base)
const DESCRIPTIONS = {
  Bouquets: {
    texte: 'Un bouquet composé et noué à la main dans notre atelier, prêt à offrir. Les tiges sont coupées le matin même.',
    entretien: 'Recoupez les tiges en biais, changez l\'eau tous les deux jours. Se garde 5 à 7 jours.',
  },
  Roses: {
    texte: 'Des roses à grosse tête, au parfum délicat, choisies une à une pour leur teinte poudrée.',
    entretien: 'Retirez les feuilles sous la ligne d\'eau et gardez le vase à l\'abri du soleil.',
  },
  Plantes: {
    texte: 'Une plante fleurie livrée en pot, facile à vivre et belle pendant plusieurs semaines.',
    entretien: 'Lumière vive sans soleil direct, un arrosage par semaine sans laisser d\'eau dans la soucoupe.',
  },
  Feuillage: {
    texte: 'Une botte de feuillage frais et parfumé pour structurer vos bouquets ou habiller une table.',
    entretien: 'Se conserve dans un fond d\'eau, ou se laisse sécher à l\'envers pour durer des mois.',
  },
  Séchées: {
    texte: 'Des fleurs séchées naturellement, légères et durables : une décoration qui ne se fane plus.',
    entretien: 'Pas d\'eau. Éloignez-les de l\'humidité et du soleil direct pour garder leurs couleurs.',
  },
};

const PAR_DEFAUT = {
  texte: 'Une création de notre atelier, préparée avec soin.',
  entretien: 'Conservez-la au frais, à l\'abri du soleil direct.',
};

export const descriptionDe = (produit) => DESCRIPTIONS[produit.categorie] ?? PAR_DEFAUT;
