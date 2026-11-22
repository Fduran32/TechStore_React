import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function Login({ onLogin }) {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [alerta, setAlerta] = useState(null);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!usuario.trim()) {
      setAlerta({
        tipo: "error",
        titulo: "Usuario requerido",
        mensaje: "Por favor ingresa tu nombre de usuario.",
      });
      return;
    }

    if (password.length < 4) {
      setAlerta({
        tipo: "error",
        titulo: "Contraseña muy corta",
        mensaje: "La contraseña debe tener al menos 4 caracteres.",
      });
      return;
    }

    // Mapeo inteligente: permite escribir "admin", "vendedor", "cliente" o el RUT directo
    const mapaAlias = {
      admin: "11111111-1",
      administrador: "11111111-1",
      felipe: "11111111-1",
      vendedor: "12345678-5",
      claudio: "12345678-5",
      cliente: "20456789-1",
    };

    const usuarioNormalizado = usuario.trim().toLowerCase();
    const rutFinal = mapaAlias[usuarioNormalizado] || usuario.trim();

    try {
      setCargando(true);
      setAlerta(null);

      // Enviamos la petición al backend con el RUT mapeado y la contraseña
      const data = await authService.login(rutFinal, password);

      setAlerta({
        tipo: "exito",
        titulo: "Autenticación Exitosa",
        mensaje: `Bienvenido/a ${usuario.trim()}. Rol asignado: [${data.rol}]. Redirigiendo...`,
      });

      // Notificamos a App.jsx para actualizar la sesión
      if (onLogin) {
        onLogin(usuario.trim(), data.rol);
      }

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (error) {
      console.error("[ERROR][LOGIN] Fallo de inicio de sesión:", error);
      const mensajeServidor = error.response?.data?.mensaje || "Usuario o contraseña incorrectos. Intenta nuevamente.";
      setAlerta({
        tipo: "error",
        titulo: "Acceso Denegado",
        mensaje: mensajeServidor,
      });
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="py-5 d-flex justify-content-center position-relative">
      {/* Alerta flotante modal */}
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
              placeholder="Ingresa tu usuario (ej: admin, vendedor, cliente)"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          {/* Campo Contraseña con Ñ */}
          <div className="mb-4">
            <label htmlFor="password" className="form-label text-secondary">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Ingresa tu clave"
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
            disabled={cargando}
          >
            {cargando ? "Verificando..." : "Ingresar"}
          </button>
        </form>

        {/* Guía visual para el evaluador */}
        <div className="mt-4 pt-3 border-top border-secondary text-secondary small">
          <div className="fw-bold mb-1">Cuentas de acceso:</div>
          <div>Admin: <code>admin</code> / <code>Admin123</code></div>
          <div>Vendedor: <code>vendedor</code> / <code>Vendedor123</code></div>
          <div>Cliente: <code>cliente</code> / <code>Cliente123</code></div>
          <div className="text-muted mt-2" style={{ fontSize: "0.75rem" }}>
            * También puedes ingresar directamente con el RUT si lo prefieres.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;