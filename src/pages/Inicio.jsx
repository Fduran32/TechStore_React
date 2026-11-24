import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import PorQueElegirnos from "../components/PorQueElegirnos";
import ListaProductos from "../components/ListaProductos";
import clienteAxios from "../services/axiosConfig";

function Inicio({ agregarAlCarrito }) {
  const base = import.meta.env.BASE_URL;
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };

  const [destacados, setDestacados] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Mapeo automático de imágenes locales según la categoría
  const mapaImagenes = {
    mouse: `${base}img/mouse.jpg`,
    teclado: `${base}img/teclado.jpg`,
    "audífonos": `${base}img/audifonos.jpg`,
    audifonos: `${base}img/audifonos.jpg`,
    monitor: `${base}img/monitor.webp`,
    mousepad: `${base}img/mousepad.webp`,
    "cámara web": `${base}img/cyber.jpg`,
    camara: `${base}img/cyber.jpg`,
    "micrófono": `${base}img/cyber2.jpg`,
    microfono: `${base}img/cyber2.jpg`,
  };

  useEffect(() => {
    async function cargarDestacados() {
      try {
        setCargando(true);
        console.log("[INFO][INICIO] Cargando productos destacados desde MySQL (GET /api/productos)...");
        const res = await clienteAxios.get("/api/productos");

        // Asignamos imágenes y seleccionamos los primeros 3 productos de la base de datos
        const productosConImagen = res.data.slice(0, 3).map((p) => {
          const catNorm = (p.categoria || "").toLowerCase().trim();
          const img = p.imagen || mapaImagenes[catNorm] || `${base}img/teclado.jpg`;
          return {
            ...p,
            imagen: img,
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
  }, [base]);

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
