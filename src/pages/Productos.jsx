import Banner from "../components/Banner"; 
import ListaProductos from "../components/ListaProductos";
import productos from "../data/productos";

function Productos() {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };

  return (
    <>
        <Banner /> 
      <h1 className="text-center mb-4 text-neon-blue fw-bold" style={fuenteOrbitron}>
        Catálogo de Productos
      </h1>

      {/* Aquí no filtramos: le pasamos el array completo */}
      <ListaProductos productos={productos} />

      <h2 className="text-center mt-5 mb-3" style={fuenteOrbitron}>
        Míralo en acción - Producto Destacado
      </h2>

      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-6">
          <video
            controls
            loop
            autoPlay
            muted
            poster="/img/teclado.jpg"
            className="img-fluid rounded shadow-sm"
          >
            <source src="/video/teclado-rgb.mp4" type="video/mp4" />
            Teclado RGB
          </video>
        </div>
      </div>
    </>
  );
}

export default Productos;