# Backend WishList GNB

API funcional para o módulo WishList usando Express e MongoDB com Mongoose.

## Instalação

1. Copie o arquivo `.env.example` para `.env`
2. Atualize `MONGODB_URI` com a URL do seu MongoDB
3. Rode:

```bash
cd backend
npm install
npm run dev
```

> Se o servidor não iniciar porque a porta `4000` já estiver em uso, use:
>
> ```bash
> npm run dev:clean
> ```

## Endpoints

- `GET /api/wishlist` - lista todos os itens
- `GET /api/wishlist/:id` - busca item por ID
- `POST /api/wishlist` - cria item
- `PUT /api/wishlist/:id` - atualiza item
- `DELETE /api/wishlist/:id` - deleta item

## Modelo de dados

A coleção do MongoDB é `wishlist`.

```json
{
  "name": "Nome do item",
  "price": 599.0,
  "category": "Casa",
  "priority": 2,
  "status": "Quero",
  "link": "https://...",
  "notes": "Observações"
}
```

Categorias válidas:
`Eletrônicos`, `Moda`, `Casa`, `Beleza`, `Alimentos`, `Esportes`, `Livros`, `Jogos`, `Viagem`, `Outros`

Prioridades:
`1` = Baixa, `2` = Média, `3` = Alta, `4` = Urgente

## Observações futuras

- Esta API não gerencia autenticação.
- Para suporte a múltiplos usuários, adicione `userId` ao modelo e filtre por `req.user.id`.
- Crie um middleware de autenticação (JWT / sessions) no futuro.
- Ajuste `FRONTEND_URL` no `.env` para permitir apenas requisições do React.
