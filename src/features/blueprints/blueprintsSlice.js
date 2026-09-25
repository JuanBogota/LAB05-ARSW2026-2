import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import blueprintsService from '../../services/blueprintsService.js'

function toFriendlyError(err) {
  const status = err.response?.status
  if (status === 401) {
    return { message: 'No autorizado: inicia sesión para consultar blueprints.', status }
  }
  if (status === 404) {
    return { message: 'Blueprint no encontrado.', status }
  }
  return { message: err.message || 'Error inesperado al consultar el servidor.', status }
}

export const fetchAuthors = createAsyncThunk(
  'blueprints/fetchAuthors',
  async (_, { rejectWithValue }) => {
    try {
      const data = await blueprintsService.getAll()
      const authors = [...new Set(data.map((bp) => bp.author))]
      return authors
    } catch (err) {
      return rejectWithValue(toFriendlyError(err))
    }
  },
)

export const fetchByAuthor = createAsyncThunk(
  'blueprints/fetchByAuthor',
  async (author, { rejectWithValue }) => {
    try {
      const items = await blueprintsService.getByAuthor(author)
      return { author, items }
    } catch (err) {
      return rejectWithValue(toFriendlyError(err))
    }
  },
)

export const fetchBlueprint = createAsyncThunk(
  'blueprints/fetchBlueprint',
  async ({ author, name }, { rejectWithValue }) => {
    try {
      return await blueprintsService.getByAuthorAndName(author, name)
    } catch (err) {
      return rejectWithValue(toFriendlyError(err))
    }
  },
)

export const createBlueprint = createAsyncThunk(
  'blueprints/createBlueprint',
  async (payload, { rejectWithValue }) => {
    try {
      return await blueprintsService.create(payload)
    } catch (err) {
      return rejectWithValue(toFriendlyError(err))
    }
  },
)

const slice = createSlice({
  name: 'blueprints',
  initialState: {
    authors: [],
    byAuthor: {},
    current: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchAuthors.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.authors = a.payload
      })
      .addCase(fetchAuthors.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload?.message || a.error.message
      })
      .addCase(fetchByAuthor.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchByAuthor.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.byAuthor[a.payload.author] = a.payload.items
      })
      .addCase(fetchByAuthor.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload?.message || a.error.message
      })
      .addCase(fetchBlueprint.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(fetchBlueprint.fulfilled, (s, a) => {
        s.status = 'succeeded'
        s.current = a.payload
      })
      .addCase(fetchBlueprint.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload?.message || a.error.message
      })
      .addCase(createBlueprint.pending, (s) => {
        s.status = 'loading'
        s.error = null
      })
      .addCase(createBlueprint.fulfilled, (s, a) => {
        s.status = 'succeeded'
        const bp = a.payload
        if (s.byAuthor[bp.author]) s.byAuthor[bp.author].push(bp)
      })
      .addCase(createBlueprint.rejected, (s, a) => {
        s.status = 'failed'
        s.error = a.payload?.message || a.error.message
      })
  },
})

export default slice.reducer