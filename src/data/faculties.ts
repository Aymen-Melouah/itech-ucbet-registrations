/** Edit this list to match the official offer of the university. */
export const FACULTIES: Record<string, string[]> = {
  "Faculté des Sciences et de la Technologie": [
    "Informatique",
    "Mathématiques",
    "Mathématiques et Informatique",
    "Physique",
    "Chimie",
  ],
  "Faculté des Sciences de la Nature et de la Vie": [
    "Biologie",
    "Sciences Agronomiques",
    "Sciences Vétérinaires",
    "Sciences de la Mer",
  ],
  "Faculté des Sciences Économiques, Commerciales et des Sciences de Gestion": [
    "Sciences Économiques",
    "Sciences Commerciales",
    "Sciences de Gestion",
    "Sciences Financières et Comptabilité",
  ],
  "Faculté des Lettres et des Langues": [
    "Langue et Littérature Arabes",
    "Langue et Littérature Françaises",
    "Langue et Littérature Anglaises",
  ],
  "Faculté de Droit et des Sciences Politiques": ["Droit", "Sciences Politiques"],
  "Faculté des Sciences Humaines et Sociales": ["Sciences Humaines", "Sciences Sociales"],
  "Annexe de l’École Normale Supérieure (formation des professeurs)": [
    "Professeur de l’enseignement primaire – Langue arabe",
    "Professeur de l’enseignement primaire – Langue française",
    "Professeur de l’enseignement primaire – Langue anglaise",
    "Professeur de l’enseignement moyen – Langue arabe",
    "Professeur de l’enseignement moyen – Langue française",
    "Professeur de l’enseignement moyen – Langue anglaise",
    "Professeur de l’enseignement secondaire – Informatique",
    "Professeur de l’enseignement secondaire – Sciences naturelles et de la vie",
  ],
};

export const LEVELS = ["L1", "L2", "L3", "M1", "M2"] as const;
