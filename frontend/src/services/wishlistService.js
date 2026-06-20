const API_BASE = process.env.REACT_APP_API_URL || '/api'

function getAuthHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    ...options,
  })

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
      return
    }
    const message = json?.message || json?.error || response.statusText || 'Erro na requisição'
    const err = new Error(message)
    err.status = response.status
    throw err
  }

  return json?.data !== undefined ? json.data : json
}

// SCRUM-76: listar com filtros opcionais { category, priority, status }
export const getWishlistItems = (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.category) params.append('category', filters.category)
  if (filters.priority) params.append('priority', filters.priority)
  if (filters.status)   params.append('status',   filters.status)
  const query = params.toString()
  return request(`/wishlist${query ? `?${query}` : ''}`)
}

export const getWishlistItem = (id) =>
  request(`/wishlist/${id}`)

export const createWishlistItem = (item) =>
  request('/wishlist', { method: 'POST', body: JSON.stringify(item) })

// SCRUM-81: edição parcial — PATCH /wishlist/:id
export const patchWishlistItem = (id, updates) =>
  request(`/wishlist/${id}`, { method: 'PATCH', body: JSON.stringify(updates) })

// SCRUM-82: atualizar só o status — PATCH /wishlist/:id/status
export const updateWishlistItemStatus = (id, status) =>
  request(`/wishlist/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })

// SCRUM-83: excluir item
export const deleteWishlistItem = (id) =>
  request(`/wishlist/${id}`, { method: 'DELETE' })
