import axios from "axios";
import { msRestantesToken, notificarSesionExpirada } from "./sesion";

// URL del backend configurable por entorno (.env -> VITE_API_URL)
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

// Instancia centralizada de Axios apuntando al backend Spring Boot
const clienteAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor de Solicitud (Request): adjunta el JWT solo si sigue vigente
clienteAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      const restante = msRestantesToken(token);

      if (restante === 0) {
        // Token vencido: no se envía y se cierra la sesión en toda la app
        console.warn("[WARN][JWT] Token expirado. Se cierra la sesion y la peticion sale sin credenciales.");
        notificarSesionExpirada();
      } else {
        console.log(`[INFO][JWT] Token valido (vigencia restante: ~${Math.round(restante / 60000)} min). Header Bearer inyectado.`);
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      console.log(`[INFO][HTTP] Peticion publica sin credenciales hacia: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("[ERROR][AXIOS] Fallo al preparar la peticion HTTP:", error);
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta (Response): gestiona errores globales
clienteAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const esLogin = error.config?.url?.includes("/auth/login");

      if (status === 401 && !esLogin) {
        // El servidor rechazó el token: se cierra la sesión también en el estado de React
        console.error("[ERROR][AUTH 401] Acceso no autorizado o token vencido:", data);
        if (localStorage.getItem("token")) {
          notificarSesionExpirada();
        }
      } else if (status === 403) {
        console.error("[ERROR][AUTH 403] Permisos insuficientes para el recurso solicitado.");
      } else if (status >= 500) {
        console.error("[ERROR][SERVER 500] Error interno en el servicio backend.");
      }
    } else {
      console.error(`[ERROR][NETWORK] Error de comunicacion con el servidor en ${API_URL}.`);
    }

    return Promise.reject(error);
  }
);

export default clienteAxios;
