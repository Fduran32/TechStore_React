import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  EVENTO_SESION_EXPIRADA,
  limpiarSesion,
  mensajeDeError,
  notificarSesionExpirada,
  tokenVigente,
} from "./sesion";
import clienteAxios from "./axiosConfig";
import { authService } from "./authService";
import { crearToken } from "../test/tokens";
import { guardarCarrito, obtenerCarrito } from "../utils/localStorage";

function llenarSesion(token) {
  localStorage.setItem("token", token);
  localStorage.setItem("usuario", "cliente");
  localStorage.setItem("rut", "20456789-1");
  localStorage.setItem("rol", "CLIENTE");
  localStorage.setItem("carrito_20456789-1", JSON.stringify([{ id: 1, nombre: "Mouse", precio: 1000, cantidad: 2 }]));
}

// Ejecuta el interceptor de solicitud de Axios sobre una configuración de prueba
function pasarPorInterceptor(config = { headers: {}, url: "/api/compras", method: "post" }) {
  return clienteAxios.interceptors.request.handlers[0].fulfilled(config);
}

describe("Gestión de sesión (JWT en el frontend)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("distingue un token vigente de uno vencido", () => {
    expect(tokenVigente(crearToken(600))).toBe(true);
    expect(tokenVigente(crearToken(-10))).toBe(false);
    expect(tokenVigente("no-es-un-jwt")).toBe(false);
    expect(tokenVigente(null)).toBe(false);
  });

  it("estaAutenticado es falso si el token guardado expiró", () => {
    llenarSesion(crearToken(-10));
    expect(authService.estaAutenticado()).toBe(false);
    llenarSesion(crearToken(600));
    expect(authService.estaAutenticado()).toBe(true);
  });

  it("logout borra token, usuario, rut y rol, pero conserva el carrito del usuario", () => {
    llenarSesion(crearToken(600));
    authService.logout();
    ["token", "usuario", "rut", "rol"].forEach((clave) =>
      expect(localStorage.getItem(clave)).toBeNull()
    );
    expect(obtenerCarrito("20456789-1")).toEqual([{ id: 1, nombre: "Mouse", precio: 1000, cantidad: 2 }]);
  });

  it("al expirar la sesión el carrito también se conserva", () => {
    llenarSesion(crearToken(-10));
    pasarPorInterceptor();
    expect(localStorage.getItem("token")).toBeNull();
    expect(obtenerCarrito("20456789-1")).toHaveLength(1);
  });

  it("cada usuario tiene su propio carrito", () => {
    guardarCarrito([{ id: 2, nombre: "Teclado", precio: 5000, cantidad: 1 }], "11111111-1");
    expect(obtenerCarrito("11111111-1")[0].nombre).toBe("Teclado");
    expect(obtenerCarrito("12345678-5")).toEqual([]);
    expect(obtenerCarrito(null)).toEqual([]);
  });

  it("el interceptor adjunta el Bearer cuando el token está vigente", () => {
    const token = crearToken(600);
    llenarSesion(token);
    const config = pasarPorInterceptor();
    expect(config.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it("con token vencido no envía el Bearer, limpia la sesión y avisa a la app", () => {
    llenarSesion(crearToken(-10));
    const escucha = vi.fn();
    window.addEventListener(EVENTO_SESION_EXPIRADA, escucha);

    const config = pasarPorInterceptor();

    expect(config.headers.Authorization).toBeUndefined();
    expect(localStorage.getItem("token")).toBeNull();
    expect(escucha).toHaveBeenCalledTimes(1);
    window.removeEventListener(EVENTO_SESION_EXPIRADA, escucha);
  });

  it("notificarSesionExpirada limpia el almacenamiento", () => {
    llenarSesion(crearToken(600));
    notificarSesionExpirada();
    expect(localStorage.getItem("token")).toBeNull();
    limpiarSesion();
  });

  it("arma el mensaje de error con el formato del backend", () => {
    const validacion = {
      response: { data: { mensaje: "Datos inválidos", errores: { precio: "El precio debe ser mayor a 0" } } },
    };
    expect(mensajeDeError(validacion, "x")).toBe("Datos inválidos: El precio debe ser mayor a 0");
    expect(mensajeDeError({ response: { data: { mensaje: "Sin stock" } } }, "x")).toBe("Sin stock");
    expect(mensajeDeError({}, "Por defecto")).toBe("Por defecto");
  });
});
