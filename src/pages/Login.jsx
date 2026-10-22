import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };

  // 1. Estados para controlar lo que el usuario escribe
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  // Hook para poder navegar a otra ruta mediante código
  const navigate = useNavigate();

  // 2. Función que se ejecuta al presionar "Ingresar"
  function handleSubmit(e) {
    e.preventDefault(); // Evita que la página se recargue

<<<<<<< HEAD
    // 3. Validación de credenciales fijas del laboratorio
    if (usuario === "felipe" && password === "1234") {
      console.log("Login correcto"); // Solo para depuración
      // Avisamos a App (guarda estado + localStorage) y redirigimos al inicio
      onLogin(usuario);
=======
    // 3. Validación de credenciales fijas del laboratorio (felipe o mario)
    if ((usuario === "felipe" || usuario === "mario") && password === "1234") {
      // Guardamos la sesión en el navegador
      sessionStorage.setItem("usuario", usuario);
      setError("");
      // Redirigimos al inicio
>>>>>>> a322f1fa4bacbde2949532a832c20aa86cc64b0c
      navigate("/");
    } else {
      console.log("Usuario o contraseña incorrectos"); // Solo para depuración
    }
  }

  return (
    <div className="py-5 d-flex justify-content-center">
      <div className="card bg-dark text-white border-secondary p-4 shadow-lg" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="text-center text-neon-blue mb-4 fw-bold" style={fuenteOrbitron}>
          Iniciar Sesión
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