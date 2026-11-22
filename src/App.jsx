import { useEffect, useState } from "react";
import Footer from "./components/footer";
import BarraNavegacion from "./components/BarraNavegacion";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import CarritoPage from "./pages/CarritoPage";
import { guardarCarrito, obtenerCarrito } from "./utils/localStorage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import CompraExitosa from "./pages/CompraExitosa";
import MisCompras from "./pages/MisCompras";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ProtectedRoute from "./components/ProtectedRoute";
import { authService } from "./services/authService";
function App() {
  // State: recuerda qué página se está mostrando
  
  // Inicializador perezoso: lee el carrito guardado ("carrito") solo al montar
  const [carrito, setCarrito] = useState(() => {
    const guardado = obtenerCarrito();
    console.log("🛒 [STATE INICIAL] Carrito recuperado desde localStorage:", guardado);
    return guardado;
  });
  const [mensajeAlerta, setMensajeAlerta] = useState(null);
  // Usuario de sesión: se lee de localStorage solo al montar
    // Usuario y Rol de sesion: se recuperan de localStorage al montar
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario") || null);
  const [rol, setRol] = useState(() => localStorage.getItem("rol") || null);

  // Verificacion de token ante recarga (F5)
  useEffect(() => {
    if (authService.estaAutenticado()) {
      authService.validarTokenServidor().then((res) => {
        if (!res) {
          console.warn("[WARN][AUTH] Sesion vencida detectada en F5. Limpiando...");
          cerrarSesion();
        } else {
          console.log("[INFO][AUTH] Sesion activa confirmada por el servidor para:", res.rut);
        }
      });
    }
  }, []);

  function iniciarSesion(rut, rolUsuario) {
    console.log("[INFO][STATE] Sesion iniciada para:", rut, "Rol:", rolUsuario);
    setUsuario(rut);
    setRol(rolUsuario);
  }

  function cerrarSesion() {
    console.log("[INFO][STATE] Cerrando sesion...");
    authService.logout();
    setUsuario(null);
    setRol(null);
  }
  function agregarAlCarrito(producto) {
    // 1. Verificamos si hay usuario conectado
    if (!usuario) {
      console.log("⚠️ [STATE CARRITO] Intento de agregar producto sin sesión iniciada");
      setMensajeAlerta("⚠️ Debes iniciar sesión para agregar productos al carrito");
      return; // Detiene la función aquí
    }

    // 2. Si sí está logueado, se agrega normalmente:
    const productoExiste = carrito.find(item => item.id === producto.id);
    if (productoExiste) {
      console.log(`➕ [STATE CARRITO] Aumentando cantidad de "${producto.nombre}": ${productoExiste.cantidad} ➔ ${productoExiste.cantidad + 1}`);
      setCarrito(
        carrito.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      console.log(`🆕 [STATE CARRITO] Nuevo producto añadido: "${producto.nombre}" (cantidad: 1)`);
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }

    setMensajeAlerta(`¡${producto.nombre} agregado al carrito!`);
  }

  function aumentarCantidad(id) {
    const item = carrito.find(p => p.id === id);
    console.log(`⬆️ [STATE CARRITO] Aumentando unidad de "${item?.nombre || id}" (ID: ${id})`);
    setCarrito(
      carrito.map(producto =>
        producto.id === id
          ? { ...producto, cantidad: producto.cantidad + 1 }
          : producto
      )
    );
  }

  function disminuirCantidad(id) {
    const item = carrito.find(p => p.id === id);
    console.log(`⬇️ [STATE CARRITO] Disminuyendo unidad de "${item?.nombre || id}" (ID: ${id})`);
    setCarrito(
      carrito
        .map(producto =>
          producto.id === id
            ? { ...producto, cantidad: producto.cantidad - 1 }
            : producto
        )
        .filter(p => p.cantidad > 0)
    );
  }

  function eliminarDelCarrito(id) {
    const item = carrito.find(p => p.id === id);
    console.log(`🗑️ [STATE CARRITO] Eliminando producto "${item?.nombre || id}" (ID: ${id})`);
    setCarrito(carrito.filter(producto => producto.id !== id));
  }

  function vaciarCarrito() {
    console.log("🧹 [STATE CARRITO] Vaciando carrito por completo (compra realizada)");
    setCarrito([]);
  }

  const totalUnidades = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  useEffect(() => {
    guardarCarrito(carrito);
    console.log("💾 [STATE CARRITO ACTUALIZADO]:", carrito);
    const totalPagar = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    console.log(`📊 [RESUMEN CARRITO]: ${totalUnidades} unidades | Total a pagar: $${totalPagar.toLocaleString("es-CL")}`);
  }, [carrito, totalUnidades]);

  useEffect(() => {
    console.log("👤 [STATE USUARIO ACTUAL]:", usuario || "(Ninguna sesión activa)");
  }, [usuario]);
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
    <BarraNavegacion totalCarrito={totalUnidades} usuario={usuario} rol={rol} onLogout={cerrarSesion}/>



      <main className="layout-wrapper my-5">
        <Routes>
          <Route path="/login" element={<Login onLogin={iniciarSesion} />} />
                   
          <Route path="/" element={<Inicio/>}/>
          <Route
          path="/productos"
          element={
            
          <Productos agregarAlCarrito={agregarAlCarrito}/>}
        
          />
          <Route
          path="/carrito"
          element={
            <ProtectedRoute usuario={usuario}>
            <CarritoPage
            carrito={carrito}
            aumentarCantidad={aumentarCantidad}
            disminuirCantidad={disminuirCantidad}
            eliminarDelCarrito={eliminarDelCarrito}
            vaciarCarrito={vaciarCarrito}
            />
            </ProtectedRoute>
          }
          
          />
          <Route
            path="/compra-exitosa"
            element={
              <ProtectedRoute usuario={usuario}>
                <CompraExitosa />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-compras"
            element={
              <ProtectedRoute usuario={usuario}>
                <MisCompras />
              </ProtectedRoute>
            }
          />
          </Routes>
      </main>

      <Footer />
            {/* 🔔 Alerta flotante fija abajo a la derecha */}
      <ToastContainer 
        position="bottom-end" 
        className="p-3 position-fixed bottom-0 end-0" 
        style={{ zIndex: 9999 }}
      >
        <Toast
          show={!!mensajeAlerta}
          onClose={() => setMensajeAlerta(null)}
          delay={2500}
          autohide
          bg="dark"
          className="border border-info text-white shadow-lg"
        >
          <Toast.Header closeButton className="bg-dark text-white border-bottom border-secondary">
            <span className="me-2">🛒</span>
            <strong className="me-auto text-neon-blue">TechStore</strong>
            <small className="text-secondary">Ahora</small>
          </Toast.Header>
          <Toast.Body className="fw-semibold">
            {mensajeAlerta}
          </Toast.Body>
        </Toast>
      </ToastContainer>
      </BrowserRouter>
  );
}

export default App;
