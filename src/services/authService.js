import clienteAxios from "./axiosConfig";

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
      // Mapeo amigable de cuentas
      const mapaNombres = {
        "11111111-1": "administrador",
        "12345678-5": "vendedor",
        "20456789-1": "cliente",
        admin: "administrador",
        administrador: "administrador",
        vendedor: "vendedor",
        cliente: "cliente",
      };

      const nombreNormalizado = nombreIngresado.trim().toLowerCase();
      const usuarioFinal = mapaNombres[nombreNormalizado] || mapaNombres[data.rut] || nombreNormalizado || data.rut;

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", usuarioFinal);
      localStorage.setItem("rut", data.rut);
      localStorage.setItem("rol", data.rol);
      console.log(`[INFO][AUTH] Sesion establecida con exito. Usuario: ${usuarioFinal} | Rol: ${data.rol}`);
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