import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };

  // 1. Estados para controlar lo que el usuario escribe
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hook para poder navegar a otra ruta mediante código
  const navigate = useNavigate();

  // 2. Función que se ejecuta al presionar "Ingresar"
  function handleSubmit(e) {
    e.preventDefault(); // Evita que la página se recargue

    // 3. Validación de credenciales fijas del laboratorio (felipe o mario)
    if ((usuario === "felipe" || usuario === "mario") && password === "1234") {
      // Guardamos la sesión en el navegador
      sessionStorage.setItem("usuario", usuario);
      setError("");
      // Redirigimos al inicio
      navigate("/");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card bg-dark text-white border-secondary p-4 shadow-lg" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="text-center text-neon-blue mb-4 fw-bold" style={fuenteOrbitron}>
          Iniciar Sesión
        </h2>

        {/* Mensaje de error condicional si las credenciales fallan */}
        {error && (
          <div className="alert alert-danger py-2 text-center" role="alert">
            {error}
          </div>
        )}

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

          {/* Campo Contraseña */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label text-secondary">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Ingresa tu contraseña (ej: 1234)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón Ingresar */}
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