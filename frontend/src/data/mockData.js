// Dados mockados centralizados — substituir por API quando o backend estiver pronto

export const MOCK_USER = {
  name: 'Juninho',
  email: 'juninho@email.com',
  avatar: null,
  monthlyIncome: 3000,
}

export const MOCK_BALANCE = {
  total: 11973.00,
  variation: 12.5,
  summary: {
    receitas: 4307.00,
    despesas: 2394.00,
    saldo: 1913.00,
  },
}

export const MOCK_EXPENSES = [
  { id: 1, name: 'Assinatura Netflix', amount: 44.90, icon: 'card', date: '2024-01-15', category: 'Entretenimento' },
  { id: 2, name: 'Aluguel apt', amount: 590.00, icon: 'home', date: '2024-01-10', category: 'Moradia' },
  { id: 3, name: 'Buquê de flores', amount: 138.90, icon: 'cart', date: '2024-01-08', category: 'Presentes' },
  { id: 4, name: 'Supermercado', amount: 347.90, icon: 'cart', date: '2024-01-05', category: 'Alimentação' },
  { id: 5, name: 'Farmácia', amount: 89.50, icon: 'card', date: '2024-01-03', category: 'Saúde' },
]

export const MOCK_WISHLIST = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    category: 'Eletrônico',
    priority: 'alta',
    price: 7999.00,
    purchased: false,
    link: 'apple.com/br/shop/iphone-15-pro',
    notes: 'Versão Titânio Natural, 256GB. Comprar na loja oficial para garantia brasileira.',
  },
  {
    id: 2,
    name: 'Cafeteira Nespresso',
    category: 'Casa',
    priority: 'alta',
    price: 599.00,
    purchased: false,
    link: '',
    notes: '',
  },
  {
    id: 3,
    name: 'Tênis Nike Air Max',
    category: 'Moda',
    priority: 'media',
    price: 899.00,
    purchased: false,
    link: '',
    notes: '',
  },
  {
    id: 4,
    name: 'Livro: Pai Rico Pai Pobre',
    category: 'Livros',
    priority: 'baixa',
    price: 49.90,
    purchased: true,
    link: '',
    notes: '',
  },
]

// Funções helpers para manipular os dados mockados (simulam API calls)

export const getWishlist = () => [...MOCK_WISHLIST]

export const getWishlistItem = (id) => {
  return MOCK_WISHLIST.find((item) => item.id === Number(id)) || null
}

export const addWishlistItem = (item) => {
  const newItem = {
    ...item,
    id: Date.now(),
    purchased: false,
  }
  MOCK_WISHLIST.push(newItem)
  return newItem
}

export const updateWishlistItem = (id, updates) => {
  const index = MOCK_WISHLIST.findIndex((item) => item.id === Number(id))
  if (index !== -1) {
    MOCK_WISHLIST[index] = { ...MOCK_WISHLIST[index], ...updates }
    return MOCK_WISHLIST[index]
  }
  return null
}

export const deleteWishlistItem = (id) => {
  const index = MOCK_WISHLIST.findIndex((item) => item.id === Number(id))
  if (index !== -1) {
    MOCK_WISHLIST.splice(index, 1)
    return true
  }
  return false
}

export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
