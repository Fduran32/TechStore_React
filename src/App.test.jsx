import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import App from "./App";
import clienteAxios from "./services/axiosConfig";
import { EVENTO_SESION_EXPIRADA, limpiarSesion } from "./services/sesion";
import { crearToken } from "./test/tokens";

vi.mock("./services/axiosConfig", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

const RUT = "20456789-1";
const CARRITO = [{ id: 1, nombre: "Mouse", precio: 1000, cantidad: 2 }];

function iniciarSesionGuardada() {
  localStorage.setItem("token", crearToken(3600, "CLIENTE", RUT));
  localStorage.setItem("usuario", "cliente");
  localStorage.setItem("rut", RUT);
  localStorage.setItem("rol", "CLIENTE");
}

function enlaceCarrito() {
  return screen.getByRole("link", { name: /Carrito/ });
}

describe("App: el carrito se conserva entre sesiones", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/TechStore_React/");
    clienteAxios.get.mockImplementation((url) =>
      Promise.resolve(url.includes("validate") ? { data: { rut: RUT, rol: "CLIENTE" } } : { data: [] })
    );
  });

  it("al expirar la sesión se oculta el carrito y al volver a entrar se recupera", async () => {
    localStorage.setItem(`carrito_${RUT}`, JSON.stringify(CARRITO));
    iniciarSesionGuardada();

    const { unmount } = render(<App />);
    // Con sesión activa se ve el contador del carrito guardado
    expect(within(enlaceCarrito()).getByText("2")).toBeInTheDocument();

    // Vence el token
    act(() => {
      limpiarSesion();
      window.dispatchEvent(new CustomEvent(EVENTO_SESION_EXPIRADA));
    });
    expect(within(enlaceCarrito()).queryByText("2")).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(`carrito_${RUT}`))).toEqual(CARRITO);
    unmount();

    // El mismo usuario vuelve a iniciar sesión: recupera sus productos
    iniciarSesionGuardada();
    render(<App />);
    expect(within(enlaceCarrito()).getByText("2")).toBeInTheDocument();
  });

  it("con el token vencido al recargar no muestra sesión, pero no borra el carrito", () => {
    localStorage.setItem(`carrito_${RUT}`, JSON.stringify(CARRITO));
    iniciarSesionGuardada();
    localStorage.setItem("token", crearToken(-10, "CLIENTE", RUT));

    render(<App />);

    expect(screen.getByRole("link", { name: /Iniciar Sesión/ })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(`carrito_${RUT}`))).toEqual(CARRITO);
  });
});
