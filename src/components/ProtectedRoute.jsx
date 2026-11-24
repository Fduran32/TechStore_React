import { Navigate } from "react-router-dom";

// children representa el componente que queremos proteger (Productos, Carrito, Inventario, etc.)
function ProtectedRoute({ usuario, rol, rolesPermitidos, children }) {
  // 1. Si no ha iniciado sesión, lo expulsamos al Login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si la ruta requiere roles específicos y el rol actual no tiene permiso
  if (rolesPermitidos && rolesPermitidos.length > 0) {
    if (!rol || !rolesPermitidos.includes(rol)) {
      console.warn(`[WARN][AUTH] Acceso denegado a la ruta. Rol actual: '${rol}'. Roles requeridos:`, rolesPermitidos);
      return <Navigate to="/" replace />;
    }
  }

  // 3. Si sí cumple con la sesión y los permisos, renderizamos el componente
  return children;
}

export default ProtectedRoute;
