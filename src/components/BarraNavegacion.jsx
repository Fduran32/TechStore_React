import { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";

function BarraNavegacion({ totalCarrito, usuario, onLogout }) {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };
  const navigate = useNavigate();

  // Estados para el modal de confirmación y el mensaje de despedida
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [despidiendo, setDespidiendo] = useState(false);

  function confirmarSalida() {
    setDespidiendo(true);

    // Muestra el mensaje "¡Hasta la próxima!" durante 1.5s y luego cierra la sesión
    setTimeout(() => {
      setMostrarConfirmacion(false);
      setDespidiendo(false);
      onLogout(); // 1. Borramos la sesión (estado + localStorage)
      navigate("/login"); // 2. Llevamos al usuario al login
    }, 1500);
  }

  return (
    <>
      {/* 🔔 Modal Flotante Centrado en Pantalla: Confirmación y Despedida */}
      {mostrarConfirmacion && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", zIndex: 99999 }}
        >
          <div
            className={`card bg-dark text-white p-4 text-center shadow-lg border-${
              despidiendo ? "info" : "secondary"
            }`}
            style={{
              maxWidth: "420px",
              width: "90%",
              borderRadius: "16px",
              borderWidth: "2px",
            }}
          >
            {!despidiendo ? (
              <>
                <h3
                  className="fw-bold mb-4 text-neon-blue"
                  style={fuenteOrbitron}
                >
                  ¿Desea cerrar sesión?
                </h3>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4 py-2"
                    onClick={() => setMostrarConfirmacion(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-4 py-2 fw-bold"
                    onClick={confirmarSalida}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3
                  className="fw-bold mb-3 text-neon-blue"
                  style={fuenteOrbitron}
                >
                  Hasta la próxima
                </h3>

                <div
                  className="spinner-border text-info spinner-border-sm mx-auto"
                  role="status"
                >
                  <span className="visually-hidden">Cerrando sesión...</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Navbar
        expand="lg"
        bg="dark"
        data-bs-theme="dark"
        className="border-bottom border-secondary"
      >
        <Container fluid className="layout-wrapper">
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold text-neon-blue"
          >
            TechStore
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="menu-principal" />

          <Navbar.Collapse id="menu-principal">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">
                Inicio
              </Nav.Link>

              <Nav.Link as={Link} to="/productos">
                Productos
              </Nav.Link>

              <Nav.Link as={Link} to="/carrito">
                🛒 Carrito{" "}
                {usuario && totalCarrito > 0 && (
                  <span className="badge bg-primary ms-1">{totalCarrito}</span>
                )}
              </Nav.Link>

              {usuario ? (
                <div className="d-flex align-items-center gap-2 ms-lg-3">
                  <Link
                    to="/mis-compras"
                    className="btn btn-outline-info fw-bold btn-sm d-flex align-items-center gap-1 text-decoration-none"
                    title="Ver mis compras realizadas"
                  >
                    👤 {usuario}
                    <span className="badge bg-info text-dark ms-1">
                      Mis Compras
                    </span>
                  </Link>
                  <button
                    onClick={() => setMostrarConfirmacion(true)}
                    className="btn btn-outline-danger btn-sm"
                    title="Cerrar sesión"
                  >
                    🚪 Salir
                  </button>
                </div>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="text-secondary"
                >
                  👤 Iniciar Sesión
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default BarraNavegacion;