type BlackDie = {
  name: string
  effect: string
}

const blackDice: BlackDie[] = [
  {
    name: "Tatou",
    effect: "Augmente de 1 la valeur de chaque dé de son groupe"
  },
  {
    name: "Cerf",
    effect: "Diminue de 1 la valeur de chaque dé de son groupe"
  },
  {
    name: "Iguane",
    effect: "Augmente de 1 la valeur de chaque dé unique de son groupe"
  },
  {
    name: "Scorpion",
    effect: "Diminue de 1 la valeur de chaque dé unique de son groupe"
  },
  {
    name: "Jaguar",
    effect: "Le dé le plus faible de son groupe prend la valeur du plus fort"
  },
  {
    name: "Abeille",
    effect: "Le dé le plus fort de son groupe prend la valeur du plus faible"
  }
]
