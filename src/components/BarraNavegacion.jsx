import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

function BarraNavegacion({ paginaActual, cambiarPagina,totalCarrito }) {
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="border-bottom border-secondary">
      <Container>
        <Navbar.Brand
          onClick={() => cambiarPagina("inicio")}
          className="fw-bold text-neon-blue"
          style={{ cursor: "pointer" }}
        >
          TechStore
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto">
            <Nav.Link
              onClick={() => cambiarPagina("inicio")}
              active={paginaActual === "inicio"}
            >
              Inicio
            </Nav.Link>

            <Nav.Link
              onClick={() => cambiarPagina("productos")}
              active={paginaActual === "productos"}
            >
              Productos
            </Nav.Link>
            <Nav.Link
            onClick={()=> cambiarPagina("carrito")}
            active={paginaActual==="carrito"}
            >🛒 Carrito {totalCarrito> 0 && <span className="badge bg-primary ms-1">{totalCarrito}</span>}
            </Nav.Link>

            <Nav.Link>Iniciar Sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BarraNavegacion;