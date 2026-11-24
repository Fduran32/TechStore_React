import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CarritoPage from "./CarritoPage";
import clienteAxios from "../services/axiosConfig";

vi.mock("../services/axiosConfig", () => ({ default: { post: vi.fn() } }));

describe("Página CarritoPage", () => {
  function renderCompra(vaciarCarrito) {
    render(
      <MemoryRouter>
        <CarritoPage
          carrito={[{ id: 1, nombre: "Mouse Gamer", precio: 20000, cantidad: 2 }]}
          vaciarCarrito={vaciarCarrito}
        />
      </MemoryRouter>
    );
  }

  it("descuenta el stock en el servidor al pagar y vacía el carrito", async () => {
    clienteAxios.post.mockResolvedValueOnce({});
    const vaciarCarrito = vi.fn();
    renderCompra(vaciarCarrito);

    await userEvent.click(screen.getByRole("button", { name: /Pagar/i }));

    expect(clienteAxios.post).toHaveBeenCalledWith("/api/compras", {
      items: [{ productoId: 1, cantidad: 2 }],
    });
    expect(vaciarCarrito).toHaveBeenCalledTimes(1);
  });

  it("no concreta la compra si no hay stock suficiente", async () => {
    clienteAxios.post.mockRejectedValueOnce({
      response: { status: 409, data: { mensaje: "No hay stock suficiente de Mouse Gamer" } },
    });
    const vaciarCarrito = vi.fn();
    renderCompra(vaciarCarrito);

    await userEvent.click(screen.getByRole("button", { name: /Pagar/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/No hay stock suficiente/);
    expect(vaciarCarrito).not.toHaveBeenCalled();
  });

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
