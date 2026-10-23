import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CarritoPage from "./CarritoPage";

function renderCarrito(props) {
  return render(
    <MemoryRouter>
      <CarritoPage {...props} />
    </MemoryRouter>
  );
}

describe("Pruebas de navegador de CarritoPage (Chromium)", () => {
  const productoMock = {
    id: 1,
    nombre: "Teclado Mecánico RGB",
    precio: 45000,
    cantidad: 2,
    imagen: "/img/teclado.jpg",
  };

  it("PF-10: muestra productos", () => {
    renderCarrito({
      carrito: [productoMock],
      aumentarCantidad: vi.fn(),
      disminuirCantidad: vi.fn(),
      eliminarDelCarrito: vi.fn(),
    });

    expect(screen.getByText(/Teclado Mecánico RGB/)).toBeInTheDocument();
  });

  it("PF-11: aumenta cantidad", async () => {
    const user = userEvent.setup();
    const aumentarCantidad = vi.fn();

    renderCarrito({
      carrito: [productoMock],
      aumentarCantidad,
      disminuirCantidad: vi.fn(),
      eliminarDelCarrito: vi.fn(),
    });

    await user.click(screen.getByRole("button", { name: "+" }));
    expect(aumentarCantidad).toHaveBeenCalledWith(1);
  });

  it("PF-12: disminuye cantidad", async () => {
    const user = userEvent.setup();
    const disminuirCantidad = vi.fn();

    renderCarrito({
      carrito: [productoMock],
      aumentarCantidad: vi.fn(),
      disminuirCantidad,
      eliminarDelCarrito: vi.fn(),
    });

    await user.click(screen.getByRole("button", { name: "-" }));
    expect(disminuirCantidad).toHaveBeenCalledWith(1);
  });

  it("PF-13: elimina producto", async () => {
    const user = userEvent.setup();
    const eliminarDelCarrito = vi.fn();

    renderCarrito({
      carrito: [productoMock],
      aumentarCantidad: vi.fn(),
      disminuirCantidad: vi.fn(),
      eliminarDelCarrito,
    });

    await user.click(screen.getByRole("button", { name: /Eliminar/i }));
    expect(eliminarDelCarrito).toHaveBeenCalledWith(1);
  });

  it("PF-14: calcula total", () => {
    renderCarrito({
      carrito: [productoMock],
      aumentarCantidad: vi.fn(),
      disminuirCantidad: vi.fn(),
      eliminarDelCarrito: vi.fn(),
    });

    // 45.000 * 2 = 90.000
    expect(screen.getAllByText("$90.000").length).toBeGreaterThanOrEqual(1);
  });

  it("PF-15: estado vacío", () => {
    renderCarrito({
      carrito: [],
      aumentarCantidad: vi.fn(),
      disminuirCantidad: vi.fn(),
      eliminarDelCarrito: vi.fn(),
    });

    expect(screen.getByText(/carrito está vacío/i)).toBeInTheDocument();
  });
});
