// Servicio "real": consume el backend de Lab04 a través de la instancia
// de axios ya configurada (con interceptor de JWT) en apiClient.js.
// Cada función desempaqueta el envoltorio {code, message, data} que
// devuelve el backend real, para exponer siempre datos "pelados" a
// quien consuma este servicio (igual que hace blueprintsApiMock.js).
import api from './apiClient.js'

async function getAll() {
  const {
    data: { data },
  } = await api.get('/blueprints')
  return data
}

async function getByAuthor(author) {
  const {
    data: { data },
  } = await api.get(`/blueprints/${encodeURIComponent(author)}`)
  return data
}

async function getByAuthorAndName(author, name) {
  const {
    data: { data },
  } = await api.get(`/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`)
  return data
}

async function create(payload) {
  const {
    data: { data },
  } = await api.post('/blueprints', payload)
  return data
}

export default { getAll, getByAuthor, getByAuthorAndName, create }