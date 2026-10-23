import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };

  // 1. Estados para controlar lo que el usuario escribe
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  // Estado para la alerta flotante en el centro de la pantalla
  const [alerta, setAlerta] = useState(null);

  // Hook para poder navegar a otra ruta mediante código
  const navigate = useNavigate();

  // 2. Función que se ejecuta al presionar "Ingresar"
  function handleSubmit(e) {
    e.preventDefault(); // Evita que la página se recargue

    console.log(`🔑 [LOGIN] Validando State credenciales -> Usuario: "${usuario}"`);

    // Validación 1: Nombre de usuario muy corto
    if (usuario.trim().length < 3) {
      console.log("⚠️ [LOGIN] Validación fallida: Nombre de usuario demasiado corto");
      setAlerta({
        tipo: "error",
        titulo: "Nombre muy corto",
        mensaje: "El nombre de usuario debe tener al menos 3 caracteres.",
      });
      return;
    }

    // Validación 2: Contraseña muy corta
    if (password.length < 4) {
      console.log("⚠️ [LOGIN] Validación fallida: Contraseña demasiado corta");
      setAlerta({
        tipo: "error",
        titulo: "Contraseña muy corta",
        mensaje: "La contraseña debe tener al menos 4 caracteres.",
      });
      return;
    }

    const usuarioNormalizado = usuario.trim().toLowerCase();

    // Validación 3: Credenciales del laboratorio (felipe o mario con 1234)
    if ((usuarioNormalizado === "felipe" || usuarioNormalizado === "mario") && password === "1234") {
      console.log(`✅ [LOGIN] Login correcto. Sesión autorizada para: "${usuario}"`);

      // 1. Guardamos en el storage de inmediato para que los tests y la sesión lo tengan
      sessionStorage.setItem("usuario", usuario.trim());
      localStorage.setItem("usuario", usuario.trim());

      // 2. Mostramos la alerta de éxito en la mitad de la pantalla
      setAlerta({
        tipo: "exito",
        titulo: "¡Inicio de sesión correcto!",
        mensaje: `Bienvenido/a a TechStore, ${usuario}. Ingresando al sistema...`,
      });

      // 3. Esperamos 1.5 segundos para que el usuario aprecie la alerta antes de desmontar el Login
      setTimeout(() => {
        if (onLogin) {
          onLogin(usuario.trim());
        }
        navigate("/");
      }, 1500);
    } else {
      console.log("❌ [LOGIN] Usuario o contraseña incorrectos");
      setAlerta({
        tipo: "error",
        titulo: "Acceso denegado",
        mensaje: "Clave y usuario incorrecto. Por favor, intenta de nuevo.",
      });
    }
  }

  return (
    <div className="py-5 d-flex justify-content-center position-relative">
      {/* 🔔 Alerta flotante en la mitad de la pantalla */}
      {alerta && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: 9999 }}
        >
          <div
            className={`card bg-dark text-white p-4 text-center shadow-lg border-${
              alerta.tipo === "exito" ? "success" : "danger"
            }`}
            style={{
              maxWidth: "420px",
              width: "90%",
              borderRadius: "16px",
              borderWidth: "2px",
            }}
          >
            <div className="mb-3" style={{ fontSize: "3rem" }}>
              {alerta.tipo === "exito" ? "🎉" : "⚠️"}
            </div>

            <h3
              className={`fw-bold mb-2 ${
                alerta.tipo === "exito" ? "text-success" : "text-danger"
              }`}
              style={fuenteOrbitron}
            >
              {alerta.titulo}
            </h3>

            <p className="text-secondary mb-4">{alerta.mensaje}</p>

            {alerta.tipo === "error" && (
              <button
                type="button"
                className="btn btn-outline-danger px-4 py-2 fw-bold"
                onClick={() => setAlerta(null)}
              >
                Intentar de nuevo
              </button>
            )}

            {alerta.tipo === "exito" && (
              <div
                className="spinner-border text-success spinner-border-sm mx-auto"
                role="status"
              >
                <span className="visually-hidden">Cargando...</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className="card bg-dark text-white border-secondary p-4 shadow-lg"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h2
          className="text-center text-neon-blue mb-4 fw-bold"
          style={fuenteOrbitron}
        >
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
              placeholder="Ingresa tu usuario (ej: felipe o mario)"
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