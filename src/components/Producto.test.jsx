import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Producto from "./Producto";

describe("Componente Producto", () => {
  const productoEjemplo = {
    id: 1,
    nombre: "Teclado Mecánico RGB",
    precio: 45000,
    descripcion: "Switches mecánicos táctiles",
    imagen: "/img/teclado.jpg",
  };

  it("muestra el producto y su precio", () => {
    render(
      <Producto
        producto={productoEjemplo}
        mostrarDetalle={true}
        agregarAlCarrito={vi.fn()}
      />
    );

    expect(screen.getByText(/Teclado Mecánico RGB/)).toBeInTheDocument();
    expect(screen.getByText(/45\.000/)).toBeInTheDocument();
  });

  it("llama a agregarAlCarrito al hacer clic en Añadir al Carrito", async () => {
    const usuario = userEvent.setup();
    const agregarAlCarrito = vi.fn();

    render(
      <Producto
        producto={productoEjemplo}
        mostrarDetalle={true}
        agregarAlCarrito={agregarAlCarrito}
      />
    );

    await usuario.click(
      screen.getByRole("button", {
        name: /Añadir al Carrito/i,
      })
    );

    expect(agregarAlCarrito).toHaveBeenCalledWith(productoEjemplo);
  });
});
