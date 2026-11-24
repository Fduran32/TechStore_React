import clienteAxios from "./axiosConfig";
import { limpiarSesion, nombreConocido, tokenVigente } from "./sesion";

export const authService = {
  // Iniciar sesion contra el backend
  async login(rut, contrasena, nombreIngresado = "") {
    console.log(`[INFO][AUTH] Iniciando autenticacion para RUT: ${rut}`);

    const respuesta = await clienteAxios.post("/api/v1/auth/login", {
      rut: rut.trim(),
      contrasena: contrasena.trim(),
    });

    const data = respuesta.data;

    if (data.token) {
      const nombre = nombreIngresado.trim().toLowerCase();
      const usuarioFinal = nombreConocido(nombre) || nombreConocido(data.rut) || nombre || data.rut;

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", usuarioFinal);
      localStorage.setItem("rut", data.rut);
      localStorage.setItem("rol", data.rol);
      console.log(`[INFO][AUTH] Sesion establecida con exito. Usuario: ${usuarioFinal} | Rol: ${data.rol}`);
    }

    return data;
  },

  // Cerrar sesion: borra token, datos del usuario y carrito
  logout() {
    console.log("[INFO][AUTH] Cerrando sesion de usuario.");
    limpiarSesion();
  },

  obtenerToken() {
    return localStorage.getItem("token");
  },

  obtenerUsuarioActual() {
    return localStorage.getItem("usuario");
  },

  obtenerRol() {
    return localStorage.getItem("rol");
  },

  // Hay sesion solo si existe un token y no ha expirado
  estaAutenticado() {
    return tokenVigente(localStorage.getItem("token"));
  },

  // Confirma el token con el servidor y sincroniza el rol con el que informa el backend
  async validarTokenServidor() {
    try {
      const respuesta = await clienteAxios.get("/api/v1/auth/validate");
      console.log("[INFO][AUTH] Token verificado correctamente en el servidor:", respuesta.data);
      if (respuesta.data?.rol) {
        localStorage.setItem("rol", respuesta.data.rol);
      }
      return respuesta.data;
    } catch (error) {
      console.warn("[WARN][AUTH] Servidor indico token no valido:", error.response?.data);
      return null;
    }
  },
};
