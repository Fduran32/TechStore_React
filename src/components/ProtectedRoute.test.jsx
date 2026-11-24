import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

function renderRuta({ usuario, rol, rolesPermitidos }) {
  render(
    <MemoryRouter initialEntries={["/inventario"]}>
      <Routes>
        <Route path="/" element={<h1>Inicio</h1>} />
        <Route path="/login" element={<h1>Login</h1>} />
        <Route
          path="/inventario"
          element={
            <ProtectedRoute usuario={usuario} rol={rol} rolesPermitidos={rolesPermitidos}>
              <h1>Inventario</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute (restricción de acceso por rol)", () => {
  const roles = ["ADMINISTRADOR", "VENDEDOR"];

  it("sin sesión redirige al login", () => {
    renderRuta({ usuario: null, rol: null, rolesPermitidos: roles });
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("un CLIENTE no puede entrar al inventario y vuelve al inicio", () => {
    renderRuta({ usuario: "cliente", rol: "CLIENTE", rolesPermitidos: roles });
    expect(screen.getByRole("heading", { name: "Inicio" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Inventario" })).not.toBeInTheDocument();
  });

  it.each(roles)("%s sí puede entrar al inventario", (rol) => {
    renderRuta({ usuario: "x", rol, rolesPermitidos: roles });
    expect(screen.getByRole("heading", { name: "Inventario" })).toBeInTheDocument();
  });
});
