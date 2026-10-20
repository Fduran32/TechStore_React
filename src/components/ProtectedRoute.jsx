import { Navigate } from "react-router-dom";

// children representa el componente que queremos proteger (Productos o Carrito)
function ProtectedRoute({ children }) {
  // 1. Verificamos si existe un usuario conectado en sessionStorage
  const usuario = sessionStorage.getItem("usuario");

  // 2. Si no ha iniciado sesión, lo expulsamos al Login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si sí ha iniciado sesión, lo dejamos ver la página
  return children;
}

export default ProtectedRoute;