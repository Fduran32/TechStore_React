import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import clienteAxios from "../services/axiosConfig";
import { crearToken } from "../test/tokens";

// El backend se simula: la prueba revisa el comportamiento del navegador, no la API
vi.mock("../services/axiosConfig", () => ({ default: { post: vi.fn(), get: vi.fn() } }));

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Página principal</h1>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("Pruebas de navegador del inicio de sesión (Chromium)", () => {
  it("PF-01: muestra el formulario de inicio de sesión", () => {
    renderLogin();

    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ingresar/i })
    ).toBeInTheDocument();
  });

  it("PF-02: permite escribir las credenciales", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/usuario/i), "claudio");
    await user.type(screen.getByLabelText(/contraseña/i), "1234");

    expect(screen.getByLabelText(/usuario/i)).toHaveValue("claudio");
    expect(screen.getByLabelText(/contraseña/i)).toHaveValue("1234");
  });

  it("PF-03: inicia sesión con credenciales válidas", async () => {
    clienteAxios.post.mockResolvedValueOnce({
      data: { token: crearToken(3600, "VENDEDOR", "12345678-5"), rut: "12345678-5", rol: "VENDEDOR" },
    });
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/usuario/i), "vendedor");
    await user.type(screen.getByLabelText(/contraseña/i), "Vendedor123");
    await user.click(
      screen.getByRole("button", { name: /ingresar/i })
    );

    expect(localStorage.getItem("usuario")).toBe("vendedor");
    expect(localStorage.getItem("rol")).toBe("VENDEDOR");
    expect(
      await screen.findByRole("heading", { name: /página principal/i }, { timeout: 3000 })
    ).toBeInTheDocument();
  });

  it("PF-04: no crea una sesión con credenciales inválidas", async () => {
    clienteAxios.post.mockRejectedValueOnce({
      response: { status: 401, data: { mensaje: "Usuario no encontrado con RUT: usuario_incorrecto" } },
    });
    const user = userEvent.setup();
    renderLogin();

    await user.type(
      screen.getByLabelText(/usuario/i),
      "usuario_incorrecto"
    );
    await user.type(
      screen.getByLabelText(/contraseña/i),
      "clave_incorrecta"
    );
    await user.click(
      screen.getByRole("button", { name: /ingresar/i })
    );

    expect(await screen.findByText(/Usuario no encontrado/)).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();
    expect(
      screen.queryByRole("heading", { name: /página principal/i })
    ).not.toBeInTheDocument();
  });
});
