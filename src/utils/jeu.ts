// src/utils/jeu.ts


export type Dice = 'potière' | 'paysan' | 'voleur' | 'scribe' | 'chaman' | 'reine'
/**
 * Calcule la valeur totale d’un groupe de dés en tenant compte
 * des effets de chaque type de dé blanc.
 * @param group - Tableau de noms de dés dans le groupe courant
 * @param opposingGroup - Tableau de noms de dés dans le groupe opposé
 * @returns Valeur numérique totale du groupe
 */
export function calculateGroupValue(
  group: string[],
  opposingGroup: string[]
): number {
  // 1) Validation des dés inconnus
  const validDice = new Set(['potière','paysan','voleur','scribe','chaman','reine']);
  for (const d of group) {
    if (!validDice.has(d)) throw new Error(`Dé inconnu : ${d}`);
  }
  // 2) Calcul des valeurs de base
  const values = group.map((die) => {
    switch (die) {
      case 'potière': return 1;
      case 'paysan':  return 2;
      case 'voleur':  return -1;
      case 'scribe':  return group.length % 2 === 0 ? 2 : 1;
      case 'chaman':  return opposingGroup.length;
      case 'reine':   return 3;
      default:
        // ne devrait jamais arriver après validation
        throw new Error(`Dé inconnu : ${die}`);
    }
  });

  // 3) Effet de la Reine : neutraliser la/les valeur(s) minimale(s) hors Reines
  const queenCount = group.filter((d) => d === 'reine').length;
  for (let i = 0; i < queenCount; i++) {
    const othersIdx = group
      .map((d, idx) => d !== 'reine' ? idx : -1)
      .filter((idx) => idx >= 0);
    if (othersIdx.length === 0) break;
    const minVal = Math.min(...othersIdx.map((i) => values[i]));
    for (const idx of othersIdx) {
      if (values[idx] === minVal) values[idx] = 0;
    }
  }

  // 4) Somme totale
  return values.reduce((sum, v) => sum + v, 0);
}

/**
 * Génére toutes les partitions uniques de `allDices` en deux groupes non-vides.
 * Pour éviter les miroirs, on force la présence du premier dé dans le groupe A.
 * @param allDices - Tableau de noms de dés
 * @returns Liste de tuples [groupeA, groupeB]
 */
export function getGroups(
  allDices: string[]
): [string[], string[]][] {
  const n = allDices.length;
  const partitions: [string[], string[]][] = [];
  const maxMask = 1 << n;
  for (let mask = 1; mask < maxMask - 1; mask++) {
    if ((mask & 1) === 0) continue; // éviter les duplications miroir
    const groupA: string[] = [];
    const groupB: string[] = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) groupA.push(allDices[i]);
      else groupB.push(allDices[i]);
    }
    partitions.push([groupA, groupB]);
  }
  return partitions;
}

/**
 * Cherche une solution équilibrée ([groupeA, groupeB]) ou renvoie null si aucune.
 * @param allDices - Tableau de noms de 7 dés
 */
export function getSolution(
  allDices: string[]
): [string[], string[]] | null {
  // Validation taille
  if (allDices.length !== 7) throw new Error(`Il faut exactement 7 dés, reçu ${allDices.length}`);
  // Validation dés
  const validDice = new Set(['potière','paysan','voleur','scribe','chaman','reine']);
  for (const d of allDices) {
    if (!validDice.has(d)) throw new Error(`Dé inconnu : ${d}`);
  }

  const parts = getGroups(allDices);
  for (const [groupA, groupB] of parts) {
    const valA = calculateGroupValue(groupA, groupB);
    const valB = calculateGroupValue(groupB, groupA);
    if (valA === valB) return [groupA, groupB];
  }

  return null;
}
