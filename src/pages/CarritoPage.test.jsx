import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CarritoPage from "./CarritoPage";

describe("Página CarritoPage", () => {
  it("muestra mensaje de carrito vacío cuando no hay productos", () => {
    render(
      <MemoryRouter>
        <CarritoPage
          carrito={[]}
          aumentarCantidad={vi.fn()}
          disminuirCantidad={vi.fn()}
          eliminarDelCarrito={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/carrito está vacío/i)).toBeInTheDocument();
  });

  it("muestra productos, calcula el total y permite interactuar con los botones", async () => {
    const usuario = userEvent.setup();
    const aumentarCantidad = vi.fn();
    const disminuirCantidad = vi.fn();
    const eliminarDelCarrito = vi.fn();

    const carritoMock = [
      {
        id: 1,
        nombre: "Mouse Gamer",
        precio: 20000,
        cantidad: 2,
        imagen: "/img/mouse.jpg",
      },
    ];

    render(
      <MemoryRouter>
        <CarritoPage
          carrito={carritoMock}
          aumentarCantidad={aumentarCantidad}
          disminuirCantidad={disminuirCantidad}
          eliminarDelCarrito={eliminarDelCarrito}
        />
      </MemoryRouter>
    );

    // Verifica que el nombre del producto y la cantidad estén presentes
    expect(screen.getByText(/Mouse Gamer/)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    // Verifica cálculo de subtotal y total ($40.000 en tabla y en total a pagar)
    expect(screen.getAllByText("$40.000").length).toBe(2);

    // Verifica que el botón 'Pagar' esté presente
    expect(screen.getByRole("button", { name: /Pagar/i })).toBeInTheDocument();

    // Prueba clic en botón '+'
    await usuario.click(screen.getByRole("button", { name: "+" }));
    expect(aumentarCantidad).toHaveBeenCalledWith(1);

    // Prueba clic en botón '-'
    await usuario.click(screen.getByRole("button", { name: "-" }));
    expect(disminuirCantidad).toHaveBeenCalledWith(1);

    // Prueba clic en botón '🗑️ Eliminar'
    await usuario.click(screen.getByRole("button", { name: /Eliminar/i }));
    expect(eliminarDelCarrito).toHaveBeenCalledWith(1);
  });
});
