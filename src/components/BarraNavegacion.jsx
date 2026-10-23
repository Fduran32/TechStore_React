import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Link, useNavigate } from "react-router-dom";

function BarraNavegacion({totalCarrito, usuario, onLogout}) {
  const navigate = useNavigate();

function cerrarSesion() {
  onLogout(); // 1. Borramos la sesión (estado + localStorage)
  navigate("/login"); // 2. Llevamos al usuario al login
}
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="border-bottom border-secondary">
      <Container fluid className="layout-wrapper">
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
            >🛒 Carrito {usuario && totalCarrito> 0 && <span className="badge bg-primary ms-1">{totalCarrito}</span>}
            </Nav.Link>
            {usuario? (
              <div className="d-flex align-items-center gap-2 ms-lg-3">
                <Link
                  to="/mis-compras"
                  className="btn btn-outline-info fw-bold btn-sm d-flex align-items-center gap-1 text-decoration-none"
                  title="Ver mis compras realizadas"
                >
                  👤 {usuario}
                  <span className="badge bg-info text-dark ms-1">Mis Compras</span>
                </Link>
                <button
                  onClick={cerrarSesion}
                  className="btn btn-outline-danger btn-sm"
                  title="Cerrar sesión"
                >
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