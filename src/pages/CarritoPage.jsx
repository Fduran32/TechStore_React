import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../services/axiosConfig";
import { guardarCompra } from "../utils/localStorage";
import { obtenerImagenProducto } from "../utils/imagenesProductos";

function CarritoPage({
  carrito,
  aumentarCantidad,
  disminuirCantidad,
  eliminarDelCarrito,
  vaciarCarrito,
}) {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };
  const [procesando, setProcesando] = useState(false);
  const [errorCompra, setErrorCompra] = useState(null);
  const navigate = useNavigate();

  const total = carrito.reduce(
    (acumulado, producto) => acumulado + producto.precio * producto.cantidad,
    0
  );

  // Función que descuenta el stock en MySQL y concreta la compra
  async function manejarPago() {
    setProcesando(true);

    setErrorCompra(null);

    try {
      console.log(`[INFO][COMPRA] Registrando compra de ${carrito.length} productos (POST /api/compras)...`);
      await clienteAxios.post("/api/compras", {
        items: carrito.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
      });
      console.log("[INFO][COMPRA] Stock rebajado exitosamente en la base de datos.");
    } catch (error) {
      console.error("[ERROR][COMPRA] La compra no se concretó:", error);
      const estado = error.response?.status;
      setErrorCompra(
        error.response?.data?.mensaje ||
          (estado === 401 || estado === 403
            ? "Tu sesión no es válida o expiró. Inicia sesión nuevamente para comprar."
            : "No se pudo confirmar la compra. Intenta nuevamente más tarde.")
      );
      setProcesando(false);
      return;
    }

    const usuario = localStorage.getItem("usuario") || "cliente";

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

    // Guarda en el historial de compras local
    guardarCompra(nuevaCompra, usuario);

    // Vacía el carrito
    vaciarCarrito?.();

    // Redirige a Compra Exitosa tras 1.5 segundos
    setTimeout(() => {
      navigate("/compra-exitosa", { state: { orden: nuevaCompra } });
    }, 1500);
  }

  // Vista cuando el carrito está vacío
  if (carrito.length === 0 && !procesando) {
    return (
      <div className="text-center py-5">
        <h2 style={fuenteOrbitron} className="text-neon-blue mb-3">
          🛒 Mi Carrito
        </h2>
        <div className="alert alert-secondary d-inline-block px-4 py-3">
          <p className="mb-0 fs-5">El carrito está vacío</p>
        </div>
        <div className="mt-3">
          <Link to="/productos" className="btn btn-neon fw-bold px-4 py-2" style={fuenteOrbitron}>
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 position-relative">
      {/* Overlay modal de procesamiento */}
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
              Descontando unidades de bodega en la base de datos...
            </p>
          </div>
        </div>
      )}

      <h2 style={fuenteOrbitron} className="text-neon-blue mb-4">
        🛒 Mi Carrito de Compras
      </h2>

      <div className="table-responsive">
        <table className="table table-dark table-hover align-middle border-secondary">
          <thead>
            <tr className="text-secondary small">
              <th>Producto</th>
              <th>Precio Unitario</th>
              <th className="text-center">Cantidad</th>
              <th>SubTotal</th>
              <th className="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((producto) => (
              <tr key={producto.id}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    {producto.imagen && (
                      <img
                        src={obtenerImagenProducto(producto)}
                        alt={producto.nombre}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "contain",
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                    <span className="fw-bold">{producto.nombre}</span>
                  </div>
                </td>
                <td>${producto.precio?.toLocaleString("es-CL")}</td>
                <td className="text-center">
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-outline-danger btn-sm px-2 fw-bold"
                      onClick={() => disminuirCantidad(producto.id)}
                    >
                      -
                    </button>
                    <span className="btn btn-dark btn-sm px-3 fw-bold disabled border-secondary">
                      {producto.cantidad}
                    </span>
                    <button
                      className="btn btn-outline-success btn-sm px-2 fw-bold"
                      onClick={() => aumentarCantidad(producto.id)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="fw-bold text-neon-blue">
                  ${(producto.precio * producto.cantidad).toLocaleString("es-CL")}
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarDelCarrito(producto.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errorCompra && (
        <div className="alert alert-danger" role="alert">
          {errorCompra}
        </div>
      )}

      {/* Barra de Total y Botón de Pago */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4 p-3 bg-dark border border-secondary rounded">
        <h3 className="mb-0 fw-bold" style={fuenteOrbitron}>
          Total a pagar:{" "}
          <span className="text-neon-blue">
            ${total.toLocaleString("es-CL")}
          </span>
        </h3>

        <button
          className="btn btn-neon fw-bold px-4 py-2"
          style={fuenteOrbitron}
          onClick={manejarPago}
          disabled={procesando}
        >
          {procesando ? "Procesando..." : "💳 Pagar y Finalizar Compra"}
        </button>
      </div>
    </div>
  );
}

export default CarritoPage;