import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obtenerCompras } from "../utils/localStorage";

function MisCompras() {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };
  const [compras, setCompras] = useState([]);
  const usuario = localStorage.getItem("usuario") || sessionStorage.getItem("usuario") || "";

  useEffect(() => {
    const historial = obtenerCompras(usuario);
    setCompras(historial);
  }, [usuario]);

  if (compras.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div
          className="card bg-dark text-white border-secondary p-5 shadow-lg mx-auto"
          style={{ maxWidth: "550px" }}
        >
          <div className="mb-3" style={{ fontSize: "3.5rem" }}>
            📦
          </div>
          <h2 className="text-neon-blue fw-bold mb-3" style={fuenteOrbitron}>
            Historial de Compras
          </h2>
          <p className="text-secondary mb-4 fs-5">
            Hola <strong className="text-white">{usuario}</strong>, aún no has realizado ninguna compra en TechStore.
          </p>
          <Link
            to="/productos"
            className="btn btn-neon px-4 py-2 fw-bold"
            style={fuenteOrbitron}
          >
            Explorar Catálogo de Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="text-neon-blue fw-bold mb-1" style={fuenteOrbitron}>
            📋 Mis Compras Realizadas
          </h2>
          <p className="text-secondary mb-0 small">
            Historial de pedidos para el usuario: <strong className="text-white">👤 {usuario}</strong> ({compras.length} {compras.length === 1 ? "pedido" : "pedidos"})
          </p>
        </div>

        <Link
          to="/productos"
          className="btn btn-outline-info btn-sm fw-bold px-3 py-2"
          style={fuenteOrbitron}
        >
          + Nueva Compra
        </Link>
      </div>

      <div className="d-flex flex-column gap-4">
        {compras.map((compra, index) => (
          <div
            key={compra.id || index}
            className="card bg-dark text-white border-secondary shadow-lg overflow-hidden"
          >
            {/* Cabecera de la orden */}
            <div className="card-header bg-black border-secondary d-flex flex-wrap justify-content-between align-items-center py-3 px-4 gap-2">
              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-primary text-uppercase px-3 py-2" style={fuenteOrbitron}>
                  Orden #{compra.id}
                </span>
                <span className="text-secondary small">
                  📅 {compra.fecha}
                </span>
              </div>

              <div>
                <span className="badge bg-success bg-opacity-25 text-success border border-success px-3 py-2 fw-semibold">
                  {compra.estado || "En preparación para despacho 🚚"}
                </span>
              </div>
            </div>

            {/* Listado de productos comprados */}
            <div className="card-body px-4 py-3">
              <div className="table-responsive">
                <table className="table table-dark table-sm align-middle mb-0">
                  <thead>
                    <tr className="text-secondary small border-secondary">
                      <th>Producto</th>
                      <th className="text-center">Precio Unitario</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">SubTotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compra.productos?.map((producto) => (
                      <tr key={producto.id} className="border-secondary">
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {producto.imagen && (
                              <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                              />
                            )}
                            <span className="fw-semibold">
                              {producto.emoji || "📦"} {producto.nombre}
                            </span>
                          </div>
                        </td>
                        <td className="text-center text-secondary">
                          ${producto.precio?.toLocaleString("es-CL")}
                        </td>
                        <td className="text-center fw-bold">
                          x{producto.cantidad}
                        </td>
                        <td className="text-end fw-bold text-neon-blue">
                          ${(producto.precio * producto.cantidad)?.toLocaleString("es-CL")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total pagado en la orden */}
            <div className="card-footer bg-black border-secondary d-flex justify-content-end align-items-center py-3 px-4">
              <h5 className="mb-0 fw-bold" style={fuenteOrbitron}>
                Total Pagado:{" "}
                <span className="text-neon-blue">
                  ${compra.total?.toLocaleString("es-CL")}
                </span>
              </h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MisCompras;
