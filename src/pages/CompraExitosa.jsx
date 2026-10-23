import { Link, useLocation } from "react-router-dom";

function CompraExitosa() {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };
  const location = useLocation();
  const orden = location.state?.orden;
  const numeroOrden = orden?.id || "TK-" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="container py-5 text-center">
      <div
        className="card bg-dark text-white border-secondary p-5 shadow-lg mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-4">
          <span style={{ fontSize: "4rem" }}>🚚💨</span>
        </div>

        <h1
          className="text-neon-blue fw-bold mb-3"
          style={fuenteOrbitron}
        >
          ¡Compra Exitosa!
        </h1>

        <div className="alert alert-success bg-dark text-success border-success py-3 mb-4">
          <h4 className="alert-heading mb-1 fw-bold">
            Se está preparando su compra para despacho
          </h4>
          <p className="mb-0 small text-secondary">
            Orden de seguimiento: <strong className="text-white">#{numeroOrden}</strong>
          </p>
        </div>

        <p className="text-secondary mb-4">
          Recibirás un correo electrónico con los detalles del envío y el código de seguimiento en cuanto el paquete salga de nuestra bodega central.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link
            to="/mis-compras"
            className="btn btn-outline-info px-4 py-2 fw-bold"
            style={fuenteOrbitron}
          >
            📋 Ver Mis Compras
          </Link>
          <Link
            to="/productos"
            className="btn btn-neon px-4 py-2 fw-bold"
            style={fuenteOrbitron}
          >
            Seguir Comprando
          </Link>
          <Link
            to="/"
            className="btn btn-outline-secondary px-4 py-2"
          >
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CompraExitosa;
