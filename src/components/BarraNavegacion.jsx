import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";

function BarraNavegacion({totalCarrito}) {
  const navigate = useNavigate();
const usuario = sessionStorage.getItem("usuario");

function cerrarSesion() {
  sessionStorage.removeItem("usuario"); // 1. Borramos la sesión
  navigate("/login"); // 2. Llevamos al usuario al login
}
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="border-bottom border-secondary">
      <Container>
        <Navbar.Brand
          as={Link} to="/" className="fw-bold text-neon-blue"
        >
          TechStore
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link} to="/"
            >
              Inicio
            </Nav.Link>

            <Nav.Link
              as={Link} to="/productos"
            >
              Productos
            </Nav.Link>
            <Nav.Link
            as={Link} to="/carrito"
            >🛒 Carrito {totalCarrito> 0 && <span className="badge bg-primary ms-1">{totalCarrito}</span>}
            </Nav.Link>
            {usuario? (
              <div className="d-flex align-items-center gap-2 ms-lg-3">
                <span className="text-neon-blue fw-bold small">
            👤 {usuario}
            </span>
            <button
            onClick={cerrarSesion}
            className="btn btn-outline-danger btn-sm"
            title="Cerrar sesion">
              🚪 Salir
              </button>
              </div>
            ):(
            

            <Nav.Link
            as={Link} to="/login" className="text-secondary"
            >              
              👤 Iniciar Sesión</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
  
}

export default BarraNavegacion;