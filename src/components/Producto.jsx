function Producto({ producto, mostrarDetalle = true, agregarAlCarrito }) {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 bg-dark text-white border-secondary shadow-sm">
        <img
          src={producto.imagen}
          className="card-img-top product-img"
          alt={producto.nombre}
          style={{ height: "220px", objectFit: "contain", backgroundColor: "#fff", padding: "12px" }}
        />

        <div className="card-body d-flex flex-column justify-content-between text-center">
          <div>
            <h5 className="card-title fw-bold" style={fuenteOrbitron}>
              {producto.nombre}
            </h5>

            {/* Solo mostramos la categoría, sin revelar números de stock */}
            <div className="d-flex justify-content-center my-2">
              <span className="badge bg-dark border border-secondary text-info">
                {producto.categoria}
              </span>
            </div>
          </div>

          {mostrarDetalle && (
            <>
              <p className="card-text text-secondary small" style={fuenteOrbitron}>
                {producto.descripcion}
              </p>
              <div className="mt-3">
                <p className="fs-4 price-neon mb-2" style={fuenteOrbitron}>
                  ${producto.precio?.toLocaleString("es-CL")}
                </p>
                <button
                  className="btn btn-neon w-100 fw-bold"
                  style={fuenteOrbitron}
                  onClick={() => agregarAlCarrito?.(producto)}
                  disabled={producto.stock <= 0}
                >
                  {producto.stock > 0 ? "Añadir al Carrito" : "Agotado"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Producto;