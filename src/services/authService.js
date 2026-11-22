import clienteAxios from "./axiosConfig";

export const authService = {
  // Iniciar sesion contra el backend
  async login(rut, contrasena) {
    console.log(`[INFO][AUTH] Iniciando autenticacion para RUT: ${rut}`);

    const respuesta = await clienteAxios.post("/api/v1/auth/login", {
      rut: rut.trim(),
      contrasena: contrasena.trim(),
    });

    const data = respuesta.data;

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", data.rut);
      localStorage.setItem("rol", data.rol);
      console.log(`[INFO][AUTH] Sesion establecida con exito. Usuario: ${data.rut} | Rol: ${data.rol}`);
    }

    return data;
  },

  // Cerrar sesion
  logout() {
    console.log("[INFO][AUTH] Cerrando sesion de usuario.");
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
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

  estaAutenticado() {
    return Boolean(localStorage.getItem("token"));
  },

  async validarTokenServidor() {
    try {
      const respuesta = await clienteAxios.get("/api/v1/auth/validate");
      console.log("[INFO][AUTH] Token verificado correctamente en el servidor:", respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.warn("[WARN][AUTH] Servidor indico token no valido:", error.response?.data);
      return null;
    }
  },
};