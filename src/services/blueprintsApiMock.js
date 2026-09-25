// Servicio "mock": simula las respuestas del backend con datos en memoria,
// sin depender de que el servidor real esté corriendo.
// Usa los mismos datos de ejemplo que trae el backend real (john/house,
// john/garage, jane/garden) para que el comportamiento sea comparable
// al alternar entre mock y backend real.

let mockBlueprints = [
  {
    author: 'john',
    name: 'house',
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ],
  },
  {
    author: 'john',
    name: 'garage',
    points: [
      { x: 5, y: 5 },
      { x: 15, y: 5 },
      { x: 15, y: 15 },
    ],
  },
  {
    author: 'jane',
    name: 'garden',
    points: [
      { x: 2, y: 2 },
      { x: 3, y: 4 },
      { x: 6, y: 7 },
    ],
  },
]

// Simula latencia de red para que el estado "loading" de Redux
// también se pueda probar/ver usando el mock.
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

async function getAll() {
  await delay()
  return mockBlueprints
}

async function getByAuthor(author) {
  await delay()
  return mockBlueprints.filter((bp) => bp.author === author)
}

async function getByAuthorAndName(author, name) {
  await delay()
  const bp = mockBlueprints.find((bp) => bp.author === author && bp.name === name)
  if (!bp) throw new Error('Blueprint not found')
  return bp
}

async function create(payload) {
  await delay()
  mockBlueprints.push(payload)
  return payload
}

export default { getAll, getByAuthor, getByAuthorAndName, create }