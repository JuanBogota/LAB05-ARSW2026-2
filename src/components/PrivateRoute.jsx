import { Navigate, Outlet } from 'react-router-dom'

// Guard de ruta: si no hay JWT en localStorage, redirige a /login
// en vez de renderizar la ruta protegida. Usa <Outlet /> para que
// cualquier ruta anidada dentro de <Route element={<PrivateRoute />}>
// se beneficie de la misma protección sin repetir esta lógica.
export default function PrivateRoute() {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}