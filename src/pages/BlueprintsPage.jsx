import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAuthors,
  fetchByAuthor,
  fetchBlueprint,
} from '../features/blueprints/blueprintsSlice.js'
import BlueprintCanvas from '../components/BlueprintCanvas.jsx'

export default function BlueprintsPage() {
  const dispatch = useDispatch()
  const { byAuthor, current, status, error } = useSelector((s) => s.blueprints)
  const [authorInput, setAuthorInput] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const items = byAuthor[selectedAuthor] || []

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  const totalPoints = useMemo(
    () => items.reduce((acc, bp) => acc + (bp.points?.length || 0), 0),
    [items],
  )

  const getBlueprints = () => {
    if (!authorInput) return
    setSelectedAuthor(authorInput)
    dispatch(fetchByAuthor(authorInput))
  }

  const openBlueprint = (bp) => {
    dispatch(fetchBlueprint({ author: bp.author, name: bp.name }))
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: '1.1fr 1.4fr', gap: 24 }}>
      <section className="grid" style={{ gap: 16 }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Blueprints</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              className="input"
              placeholder="Author"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
            />
            <button className="btn primary" onClick={getBlueprints}>
              Get blueprints
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>
            {selectedAuthor ? `${selectedAuthor}'s blueprints:` : 'Results'}
          </h3>
          {status === 'loading' && <p>Cargando...</p>}
          {status === 'failed' && error && (
              <div>
                  <p className="error-text">{error}</p>
                  <button className="btn" onClick={getBlueprints} disabled={!authorInput}>Reintentar
                      </button>
                      </div>
                      )}
          {status !== 'loading' && status !== 'failed' && !items.length && (
              <p className="empty-state">Sin resultados.</p>
          )}
            {!!items.length && (
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                              <th>Blueprint name</th>
                              <th className="numeric">Number of points</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((bp) => (
                              <tr key={bp.name}>
                                <td>{bp.name}</td>
                                <td className="numeric">{bp.points?.length || 0}</td>
                                <td>
                                  <button className="btn" onClick={() => openBlueprint(bp)}>
                                    Open
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
          <p className="total-points">Total user points: {totalPoints}</p>
          </div>
      </section>

      <section className="card">
        <h3 style={{ marginTop: 0 }}>Current blueprint: {current?.name || '—'}</h3>
        <BlueprintCanvas points={current?.points || []} />
      </section>
    </div>
  )
}
