import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };

  // 1. Estados para controlar lo que el usuario escribe
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  // Hook para poder navegar a otra ruta mediante cÃ³digo
  const navigate = useNavigate();

  // 2. FunciÃ³n que se ejecuta al presionar "Ingresar"
  function handleSubmit(e) {
    e.preventDefault(); // Evita que la pÃ¡gina se recargue

    // ValidaciÃ³n de credenciales fijas del laboratorio (felipe o mario)
    if ((usuario === "felipe" || usuario === "mario") && password === "1234") {
      // App administra el estado persistente; el respaldo permite usar Login aislado.
      if (onLogin) {
        onLogin(usuario);
      } else {
        sessionStorage.setItem("usuario", usuario);
      }
      navigate("/");
    } else {
      console.log("Usuario o contraseÃ±a incorrectos"); // Solo para depuraciÃ³n
    }
  }

  return (
    <div className="py-5 d-flex justify-content-center">
      <div className="card bg-dark text-white border-secondary p-4 shadow-lg" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="text-center text-neon-blue mb-4 fw-bold" style={fuenteOrbitron}>
          Iniciar Sesion
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Campo Usuario */}
          <div className="mb-3">
            <label htmlFor="usuario" className="form-label text-secondary">
              Usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Ingresa tu usuario (ej: mario)"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          {/* Campo ContraseÃ±a */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label text-secondary">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Ingresa tu contraseÃ±a (ej: 1234)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* BotÃ³n Ingresar */}
          <button
            type="submit"
            className="btn btn-neon w-100 fw-bold py-2"
            style={fuenteOrbitron}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;