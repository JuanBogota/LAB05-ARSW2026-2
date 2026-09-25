// Punto único de acceso a datos de blueprints para el resto de la app.
// Decide, según la variable de entorno VITE_USE_MOCK, si se sirve desde
// datos en memoria (blueprintsApiMock) o desde el backend real
// (blueprintsApiClient). Ambos exponen exactamente la misma interfaz
// (getAll, getByAuthor, getByAuthorAndName, create), por lo que el
// resto de la aplicación (blueprintsSlice.js) no necesita saber cuál
// de los dos está usando.
import mockService from './blueprintsApiMock.js'
import realService from './blueprintsApiClient.js'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export default useMock ? mockService : realService