const WishlistPriority = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
  labels: {
    1: 'Baixa',
    2: 'Média',
    3: 'Alta',
    4: 'Urgente',
  },
  descriptions: {
    1: 'Baixa prioridade',
    2: 'Média prioridade',
    3: 'Alta prioridade',
    4: 'Urgente prioridade',
  },
  values: [1, 2, 3, 4],
}

module.exports = WishlistPriority
