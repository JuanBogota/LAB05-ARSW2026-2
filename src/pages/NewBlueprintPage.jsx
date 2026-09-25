import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BlueprintForm from '../components/BlueprintForm.jsx'
import { createBlueprint } from '../features/blueprints/blueprintsSlice.js'

export default function NewBlueprintPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const handleSubmit = async (payload) => {
    setError(null)
    try {
      await dispatch(createBlueprint(payload)).unwrap()
      navigate('/')
    } catch (err) {
      setError(err?.message || 'No se pudo crear el blueprint.')
    }
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <BlueprintForm onSubmit={handleSubmit} />
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}