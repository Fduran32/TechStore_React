// Utilidades de sesión compartidas por authService y el cliente Axios.
// Vive en un archivo aparte para que axiosConfig no dependa de authService (evita import circular).

export const EVENTO_SESION_EXPIRADA = "techstore:sesion-expirada";

const CLAVES_SESION = ["token", "usuario", "rut", "rol"];

// Nombres amigables de las cuentas de prueba
const NOMBRES = {
  "11111111-1": "administrador",
  "12345678-5": "vendedor",
  "20456789-1": "cliente",
  admin: "administrador",
  administrador: "administrador",
  vendedor: "vendedor",
  cliente: "cliente",
};

// Devuelve el nombre amigable si la cuenta es conocida, o "" si no lo es
export function nombreConocido(valor) {
  if (!valor) return "";
  return NOMBRES[valor.toLowerCase()] || NOMBRES[valor] || "";
}

// Nombre para mostrar: el amigable si existe, si no el mismo valor
export function nombreVisible(valor) {
  return nombreConocido(valor) || valor || "";
}

// Lee el payload del JWT (sin validar la firma: eso lo hace el backend)
export function leerPayloadToken(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch {
    return null;
  }
}

// Milisegundos que le quedan al token (0 si expiró o es inválido)
export function msRestantesToken(token) {
  const payload = token ? leerPayloadToken(token) : null;
  if (!payload?.exp) return 0;
  return Math.max(0, payload.exp * 1000 - Date.now());
}

export function tokenVigente(token) {
  return msRestantesToken(token) > 0;
}

export function limpiarSesion() {
  // El carrito (carrito_<rut>) NO se borra: el usuario lo recupera al volver a iniciar sesión
  CLAVES_SESION.forEach((clave) => localStorage.removeItem(clave));
}

// Avisa a la app (App.jsx) que la sesión ya no es válida, para que limpie el estado de React
export function notificarSesionExpirada() {
  limpiarSesion();
  window.dispatchEvent(new CustomEvent(EVENTO_SESION_EXPIRADA));
}

// Mensaje de error legible a partir de la respuesta del backend (GlobalExceptionHandler)
export function mensajeDeError(error, porDefecto) {
  const data = error?.response?.data;
  if (data?.errores) {
    return `${data.mensaje}: ${Object.values(data.errores).join(", ")}`;
  }
  return data?.mensaje || porDefecto;
}
