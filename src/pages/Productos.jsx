import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import ListaProductos from "../components/ListaProductos";
import clienteAxios from "../services/axiosConfig";
import { obtenerImagenProducto } from "../utils/imagenesProductos";

function Productos({ agregarAlCarrito }) {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };
  const base = import.meta.env.BASE_URL;

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarProductos() {
      try {
        setCargando(true);
        console.log("[INFO][PRODUCTOS] Solicitando catalogo a Spring Boot (GET /api/productos)...");

        const respuesta = await clienteAxios.get("/api/productos");
        
        // Asignamos la imagen según el nombre a cada producto traído de MySQL
        const productosConImagen = respuesta.data.map((p) => {
          return {
            ...p,
            imagen: obtenerImagenProducto(p),
          };
        });

        console.log(`[INFO][PRODUCTOS] Se recibieron ${productosConImagen.length} productos desde MySQL.`);
        setProductos(productosConImagen);
        setError(null);
      } catch (err) {
        console.error("[ERROR][PRODUCTOS] No se pudo cargar el catalogo:", err);
        setError("No se pudo conectar con el servicio de productos. Asegurate de que el backend este activo.");
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  return (
    <>
      <Banner />
      <h1 className="text-center mb-4 text-neon-blue fw-bold" style={fuenteOrbitron}>
        Catálogo de Productos
      </h1>

      {/* Indicador de carga */}
      {cargando && (
        <div className="text-center my-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-secondary mt-2" style={fuenteOrbitron}>
            Cargando catálogo desde la base de datos...
          </p>
        </div>
      )}

      {/* Mensaje de error si el backend está caído */}
      {error && !cargando && (
        <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: "600px" }}>
          <p className="mb-0">{error}</p>
        </div>
      )}

      {/* Listado de productos reales */}
      {!cargando && !error && (
        <ListaProductos productos={productos} agregarAlCarrito={agregarAlCarrito} />
      )}

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
            poster={`${base}img/teclado.jpg`}
            className="img-fluid rounded shadow-sm"
          >
            <source src={`${base}video/teclado-rgb.mp4`} type="video/mp4" />
            Teclado RGB
          </video>
        </div>
      </div>
    </>
  );
}

export default Productos;