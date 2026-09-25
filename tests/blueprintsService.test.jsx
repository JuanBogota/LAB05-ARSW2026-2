import { describe, it, expect, beforeEach, vi } from 'vitest'

// Estas pruebas verifican el comportamiento del "interruptor" del Punto 4:
// blueprintsService.js decide, según VITE_USE_MOCK, cuál implementación
// exponer. Como esa decisión ocurre al cargar el módulo (código de nivel
// superior), hay que:
//   1. Fijar la variable de entorno con vi.stubEnv ANTES de importar.
//   2. Resetear el registro de módulos (vi.resetModules) entre pruebas,
//      para forzar que blueprintsService.js se vuelva a evaluar con el
//      nuevo valor, en vez de reusar el módulo ya cacheado de la prueba anterior.

describe('blueprintsService (switch mock/real)', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  it('expone blueprintsApiMock cuando VITE_USE_MOCK=true', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true')

    const { default: service } = await import('../src/services/blueprintsService.js')
    const { default: mockService } = await import('../src/services/blueprintsApiMock.js')

    expect(service).toBe(mockService)
  })

  it('expone blueprintsApiClient cuando VITE_USE_MOCK=false', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'false')

    const { default: service } = await import('../src/services/blueprintsService.js')
    const { default: realService } = await import('../src/services/blueprintsApiClient.js')

    expect(service).toBe(realService)
  })

  it('el mock respeta el contrato: getByAuthor filtra solo los blueprints de ese autor', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true')
    const { default: service } = await import('../src/services/blueprintsService.js')

    const items = await service.getByAuthor('john')

    expect(items.length).toBe(2)
    expect(items.every((bp) => bp.author === 'john')).toBe(true)
  })

  it('el mock respeta el contrato: getByAuthorAndName retorna un blueprint específico con sus puntos', async () => {
    vi.stubEnv('VITE_USE_MOCK', 'true')
    const { default: service } = await import('../src/services/blueprintsService.js')

    const bp = await service.getByAuthorAndName('john', 'house')

    expect(bp.name).toBe('house')
    expect(bp.points.length).toBe(4)
  })
})