import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";

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
  sessionStorage.clear();
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
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/usuario/i), "claudio");
    await user.type(screen.getByLabelText(/contraseña/i), "1234");
    await user.click(
      screen.getByRole("button", { name: /ingresar/i })
    );

    expect(sessionStorage.getItem("usuario")).toBe("claudio");
    expect(
      await screen.findByRole("heading", { name: /página principal/i }, { timeout: 3000 })
    ).toBeInTheDocument();
  });

  it("PF-04: no crea una sesión con credenciales inválidas", async () => {
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

    expect(sessionStorage.getItem("usuario")).toBeNull();
    expect(
      screen.queryByRole("heading", { name: /página principal/i })
    ).not.toBeInTheDocument();
  });
});
