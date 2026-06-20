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
  { id: 1, name: 'Assinatura Netflix', amount: 44.90,  icon: 'card', date: '2024-01-15', category: 'Entretenimento' },
  { id: 2, name: 'Aluguel apt',        amount: 590.00, icon: 'home', date: '2024-01-10', category: 'Moradia'        },
  { id: 3, name: 'Buquê de flores',    amount: 138.90, icon: 'cart', date: '2024-01-08', category: 'Presentes'      },
  { id: 4, name: 'Supermercado',       amount: 347.90, icon: 'cart', date: '2024-01-05', category: 'Alimentação'    },
  { id: 5, name: 'Farmácia',           amount: 89.50,  icon: 'card', date: '2024-01-03', category: 'Saúde'          },
]

export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
