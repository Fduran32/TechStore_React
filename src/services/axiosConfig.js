import axios from "axios";

// Instancia centralizada de Axios apuntando al backend Spring Boot
const clienteAxios = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor de Solicitud (Request): inyecta y valida el JWT antes de salir
clienteAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decodificación manual del payload JWT (Base64)
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));

        const tiempoActual = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < tiempoActual) {
          const expiracionStr = new Date(payload.exp * 1000).toLocaleTimeString();
          console.warn(`[WARN][JWT] Token expirado a las ${expiracionStr}. Peticion rechazada.`);
        } else {
          const minutosRestantes = payload.exp ? Math.round((payload.exp - tiempoActual) / 60) : 0;
          console.log(`[INFO][JWT] Token valido (vigencia restante: ~${minutosRestantes} min). Header Bearer inyectado.`);
        }
      } catch (e) {
        console.log(`[INFO][JWT] Token presente en localStorage. Adjuntando a la cabecera.`);
      }

      config.headers.Authorization = `Bearer ${token}`;
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

// Interceptor de Respuesta (Response): gestiona errores globales como 401
clienteAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        console.error("[ERROR][AUTH 401] Acceso no autorizado o token vencido:", data);
        
        if (localStorage.getItem("token")) {
          console.warn("[WARN][AUTH] Limpiando credenciales invalidas de localStorage.");
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          localStorage.removeItem("rol");
        }
      } else if (status === 403) {
        console.error("[ERROR][AUTH 403] Permisos insuficientes para el recurso solicitado.");
      } else if (status >= 500) {
        console.error("[ERROR][SERVER 500] Error interno en el servicio backend.");
      }
    } else {
      console.error("[ERROR][NETWORK] Error de comunicacion con el servidor en http://localhost:8080.");
    }

    return Promise.reject(error);
  }
);

export default clienteAxios;