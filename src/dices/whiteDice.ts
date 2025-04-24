type WhiteDie = {
  name: string
  value: string | number
  effect: string
}

const whiteDice: WhiteDie[] = [
  {
    name: "Potière",
    value: 1,
    effect: "Valeur fixe de 1"
  },
  {
    name: "Paysan",
    value: 2,
    effect: "Valeur fixe de 2"
  },
  {
    name: "Voleuse",
    value: -1,
    effect: "Valeur fixe de -1"
  },
  {
    name: "Scribe",
    value: "1 ou 2",
    effect: "1 si le nombre de dés dans son groupe est impair, sinon 2"
  },
  {
    name: "Chamane",
    value: "variable",
    effect: "Valeur égale au nombre de dés dans le groupe opposé"
  },
  {
    name: "Reine",
    value: 3,
    effect: "Réduit à 0 la valeur du ou des dés les plus faibles dans son groupe, hors elle-même"
  }
]
