const API_BASE = process.env.REACT_APP_API_URL || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = data?.error || response.statusText || 'Erro na requisição'
    throw new Error(message)
  }

  return data
}

export const getWishlistItems = () => request('/wishlist')
export const getWishlistItem = (id) => request(`/wishlist/${id}`)
export const createWishlistItem = (item) => request('/wishlist', {
  method: 'POST',
  body: JSON.stringify(item),
})
export const updateWishlistItem = (id, updates) => request(`/wishlist/${id}`, {
  method: 'PUT',
  body: JSON.stringify(updates),
})
export const deleteWishlistItem = (id) => request(`/wishlist/${id}`, {
  method: 'DELETE',
})
