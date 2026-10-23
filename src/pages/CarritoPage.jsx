import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { guardarCompra } from "../utils/localStorage";

function CarritoPage({ carrito, aumentarCantidad, disminuirCantidad, eliminarDelCarrito, vaciarCarrito }){
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };
  const [procesando, setProcesando] = useState(false);
  const navigate = useNavigate();

  const total = carrito.reduce(
    (acumulado, producto) => acumulado + producto.precio * producto.cantidad,
    0
  );

  function manejarPago() {
    setProcesando(true);

    const usuario = localStorage.getItem("usuario") || sessionStorage.getItem("usuario") || "usuario";

    const nuevaCompra = {
      id: "TK-" + Math.floor(100000 + Math.random() * 900000),
      fecha: new Date().toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      usuario,
      productos: [...carrito],
      total,
      estado: "En preparación para despacho 🚚",
    };

    // Guarda la orden en el historial de compras del usuario
    guardarCompra(nuevaCompra, usuario);

    // Vacía el carrito al presionar pagar
    vaciarCarrito?.();

    // Espera 3 segundos simulando el procesamiento y redirige
    setTimeout(() => {
      navigate("/compra-exitosa", { state: { orden: nuevaCompra } });
    }, 3000);
  }

  if (carrito.length === 0 && !procesando) {
    return (
      <div className="py-5 d-flex justify-content-center">
        <div
          className="card bg-dark text-white border-secondary p-4 shadow-lg text-center"
          style={{ maxWidth: "420px", width: "100%" }}
        >
          <h2 style={fuenteOrbitron} className="text-neon-blue mb-4 fw-bold">
            🛒 Mi Carrito
          </h2>
          <p className="text-secondary fs-5 mb-4">El carrito está vacío</p>
          <Link
            to="/productos"
            className="btn btn-neon w-100 fw-bold py-2"
            style={fuenteOrbitron}
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 position-relative">
      {/* ⏳ Overlay de procesamiento de compra durante los 3 segundos */}
      {procesando && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", zIndex: 9999 }}
        >
          <div
            className="card bg-dark text-white border-info p-5 text-center shadow-lg"
            style={{ maxWidth: "460px" }}
          >
            <div
              className="spinner-border text-info mb-4 mx-auto"
              role="status"
              style={{ width: "3.5rem", height: "3.5rem" }}
            >
              <span className="visually-hidden">Procesando...</span>
            </div>
            <h3 className="text-neon-blue fw-bold mb-2" style={fuenteOrbitron}>
              Procesando su compra...
            </h3>
            <p className="text-secondary mb-0">
              Por favor espere unos segundos mientras validamos su pago.
            </p>
          </div>
        </div>
      )}

      <h2 style={fuenteOrbitron} className="text-neon-blue mb-4">
        🛒 Mi Carrito de Compras
      </h2>

      {/* Listado responsivo de productos del carrito (optimizado para móvil y PC) */}
      <div className="d-flex flex-column gap-3">
        {carrito.map((producto) => (
          <div
            key={producto.id}
            className="card bg-dark text-white border-secondary p-3 shadow-sm"
          >
            <div className="row align-items-center g-3">
              {/* Foto, nombre y precio unitario */}
              <div className="col-12 col-md-5">
                <div className="d-flex align-items-center gap-3">
                  {producto.imagen && (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                  <div>
                    <h5 className="mb-1 fw-bold">
                      {producto.emoji || "📦"} {producto.nombre}
                    </h5>
                    <p className="mb-0 text-secondary small">
                      Precio unitario: ${producto.precio.toLocaleString("es-CL")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones de cantidad (- 2 +) */}
              <div className="col-6 col-md-3 text-start text-md-center">
                <div className="btn-group" role="group">
                  <button
                    className="btn btn-outline-danger btn-sm px-2 px-md-3 fw-bold"
                    onClick={() => disminuirCantidad(producto.id)}
                  >
                    -
                  </button>
                  <span className="btn btn-dark btn-sm px-3 fw-bold disabled border-secondary text-white">
                    {producto.cantidad}
                  </span>
                  <button
                    className="btn btn-outline-success btn-sm px-2 px-md-3 fw-bold"
                    onClick={() => aumentarCantidad(producto.id)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Subtotal y Botón Eliminar */}
              <div className="col-6 col-md-4 d-flex justify-content-end align-items-center gap-2 gap-md-3">
                <div className="text-end">
                  <small className="text-secondary d-none d-md-block">Subtotal</small>
                  <span className="fw-bold text-neon-blue fs-5">
                    ${(producto.precio * producto.cantidad).toLocaleString("es-CL")}
                  </span>
                </div>

                <button
                  className="btn btn-danger btn-sm px-2 px-md-3"
                  onClick={() => eliminarDelCarrito(producto.id)}
                  title="Eliminar producto"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4 p-3 bg-dark border border-secondary rounded">
        <Link to="/productos" className="btn btn-outline-secondary">
          ← Continuar comprando
        </Link>

        <div className="d-flex align-items-center gap-3">
          <h3 className="mb-0 fw-bold" style={fuenteOrbitron}>
            Total a pagar:{" "}
            <span className="text-neon-blue">
              ${total.toLocaleString("es-CL")}
            </span>
          </h3>

          <button
            className="btn btn-neon px-4 py-2 fw-bold"
            style={fuenteOrbitron}
            onClick={manejarPago}
            disabled={procesando}
          >
            💳 Pagar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarritoPage;
