import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import PorQueElegirnos from "../components/PorQueElegirnos";
import ListaProductos from "../components/ListaProductos";
import clienteAxios from "../services/axiosConfig";
import { obtenerImagenProducto } from "../utils/imagenesProductos";

function Inicio({ agregarAlCarrito }) {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };

  const [destacados, setDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarDestacados() {
      try {
        setCargando(true);
        console.log("[INFO][INICIO] Cargando productos destacados desde MySQL (GET /api/productos)...");
        const res = await clienteAxios.get("/api/productos");

        // Asignamos imágenes y seleccionamos los primeros 3 productos de la base de datos
        const productosConImagen = res.data.slice(0, 3).map((p) => {
          return {
            ...p,
            imagen: obtenerImagenProducto(p),
          };
        });

        setDestacados(productosConImagen);
      } catch (err) {
        console.error("[ERROR][INICIO] No se pudieron cargar los productos destacados:", err);
      } finally {
        setCargando(false);
      }
    }

    cargarDestacados();
  }, []);

  return (
    <>
      <Banner />

      <section className="mb-5">
        <h2 className="text-center mb-4 text-neon-blue fw-bold" style={fuenteOrbitron}>
          Productos Destacados
        </h2>

        {cargando ? (
          <div className="text-center py-4">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Cargando destacados...</span>
            </div>
            <p className="text-secondary mt-2 small">Cargando productos desde la base de datos...</p>
          </div>
        ) : (
          <ListaProductos
            productos={destacados}
            mostrarDetalle={false}
            agregarAlCarrito={agregarAlCarrito}
          />
        )}
      </section>

      <PorQueElegirnos />
    </>
  );
}

export default Inicio;
