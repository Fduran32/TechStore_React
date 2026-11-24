import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import clienteAxios from "../services/axiosConfig";
import { crearToken } from "../test/tokens";

vi.mock("../services/axiosConfig", () => ({ default: { post: vi.fn(), get: vi.fn() } }));

function renderLogin(onLogin = vi.fn()) {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/" element={<h1>Página principal</h1>} />
      </Routes>
    </MemoryRouter>
  );
  return onLogin;
}

async function ingresar(usuario, clave) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Usuario"), usuario);
  await user.type(screen.getByLabelText("Contraseña"), clave);
  await user.click(screen.getByRole("button", { name: "Ingresar" }));
}

describe("Componente Login", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("muestra los campos y el botón de ingreso", () => {
    renderLogin();

    expect(screen.getByLabelText("Usuario")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ingresar" })).toBeInTheDocument();
  });

  it("con credenciales válidas guarda el JWT, el rol y avisa a la app", async () => {
    const token = crearToken(3600, "ADMINISTRADOR", "11111111-1");
    clienteAxios.post.mockResolvedValueOnce({
      data: { token, rut: "11111111-1", rol: "ADMINISTRADOR" },
    });
    const onLogin = renderLogin();

    await ingresar("admin", "Admin123");

    // El alias "admin" se traduce al RUT antes de llamar al backend
    expect(clienteAxios.post).toHaveBeenCalledWith("/api/v1/auth/login", {
      rut: "11111111-1",
      contrasena: "Admin123",
    });
    expect(localStorage.getItem("token")).toBe(token);
    expect(localStorage.getItem("rol")).toBe("ADMINISTRADOR");
    expect(onLogin).toHaveBeenCalledWith("administrador", "ADMINISTRADOR");
    expect(
      await screen.findByRole("heading", { name: /página principal/i }, { timeout: 3000 })
    ).toBeInTheDocument();
  });

  it("con credenciales inválidas muestra el mensaje del servidor y no crea sesión", async () => {
    clienteAxios.post.mockRejectedValueOnce({
      response: { status: 401, data: { mensaje: "Contraseña incorrecta para el RUT: 11111111-1" } },
    });
    const onLogin = renderLogin();

    await ingresar("admin", "malaClave");

    expect(await screen.findByText(/Contraseña incorrecta/)).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
    expect(onLogin).not.toHaveBeenCalled();
  });
});
