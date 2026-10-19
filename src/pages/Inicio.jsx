import Banner from "../components/Banner";
import PorQueElegirnos from "../components/PorQueElegirnos";
import ListaProductos from "../components/ListaProductos";
import productos from "../data/productos";

function Inicio() {
  // De los 6 productos, nos quedamos solo con los destacados
  const destacados = productos.filter((producto) => producto.destacado);

  return (
    <>
      <Banner />

      <section className="mb-5">
        <h2 className="text-center mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Productos Destacados
        </h2>
        <ListaProductos productos={destacados} mostrarDetalle={false} />
      </section>

      <PorQueElegirnos />
    </>
  );
}

export default Inicio;