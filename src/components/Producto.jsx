function Producto({ producto, mostrarDetalle, agregarAlCarrito }) {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 bg-dark text-white border-secondary shadow-sm">
        <img src={producto.imagen} className="card-img-top product-img" alt={producto.nombre} />

        <div className="card-body d-flex flex-column justify-content-between text-center">
          <h5 className="card-title fw-bold" style={fuenteOrbitron}>{producto.nombre}</h5>

          {mostrarDetalle && (
            <>
              <p className="card-text text-secondary small" style={fuenteOrbitron}>
                {producto.descripcion}
              </p>
              <div className="mt-3">
                <p className="fs-4 price-neon mb-2" style={fuenteOrbitron}>
                  ${producto.precio.toLocaleString("es-CL")}
                </p>
                <button
                  className="btn btn-neon w-100 fw-bold"
                  style={fuenteOrbitron}
                  onClick={() => agregarAlCarrito?.(producto)}
                >
                  Añadir al Carrito
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
