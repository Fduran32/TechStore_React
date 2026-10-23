import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MisCompras from "./MisCompras";
import { guardarCompra } from "../utils/localStorage";

describe("Página MisCompras", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("usuario", "felipe");
  });

  it("muestra estado vacío cuando el usuario no tiene compras registradas", () => {
    render(
      <MemoryRouter>
        <MisCompras />
      </MemoryRouter>
    );

    expect(screen.getByText(/aún no has realizado ninguna compra/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explorar Catálogo/i })).toBeInTheDocument();
  });

  it("muestra las compras acumuladas cuando el usuario realiza compras", () => {
    const compra1 = {
      id: "TK-111111",
      fecha: "23/10/2026, 09:00",
      usuario: "felipe",
      productos: [{ id: 1, nombre: "Teclado Mecánico RGB", precio: 45000, cantidad: 1 }],
      total: 45000,
      estado: "En preparación para despacho 🚚",
    };

    const compra2 = {
      id: "TK-222222",
      fecha: "23/10/2026, 09:30",
      usuario: "felipe",
      productos: [{ id: 2, nombre: "Mouse Gamer", precio: 20000, cantidad: 2 }],
      total: 40000,
      estado: "En preparación para despacho 🚚",
    };

    guardarCompra(compra1, "felipe");
    guardarCompra(compra2, "felipe");

    render(
      <MemoryRouter>
        <MisCompras />
      </MemoryRouter>
    );

    // Ambas órdenes deben aparecer en pantalla
    expect(screen.getByText(/Orden #TK-111111/i)).toBeInTheDocument();
    expect(screen.getByText(/Orden #TK-222222/i)).toBeInTheDocument();

    // Verificamos productos dentro de las compras
    expect(screen.getByText(/Teclado Mecánico RGB/i)).toBeInTheDocument();
    expect(screen.getByText(/Mouse Gamer/i)).toBeInTheDocument();

    // Verificamos totales
    expect(screen.getAllByText(/\$45\.000/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/\$40\.000/).length).toBeGreaterThanOrEqual(1);
  });
});
