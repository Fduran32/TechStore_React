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
function App() {
  // State: recuerda qué página se está mostrando
  
  // Inicializador perezoso: lee el carrito guardado ("carrito") solo al montar,
  // así el useEffect de abajo no lo sobrescribe con un array vacío
  const [carrito,setCarrito] = useState(obtenerCarrito);
  const [mensajeAlerta, setMensajeAlerta] = useState(null);
  // Usuario de sesión: se lee de localStorage solo al montar
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario") || null);

  function iniciarSesion(nombre) {
    localStorage.setItem("usuario", nombre);
    setUsuario(nombre);
  }

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  function agregarAlCarrito(producto) {
  // 1. Verificamos si hay usuario conectado
  if (!usuario) {
    // Si no está logueado, le avisamos con la alerta flotante y no guardamos nada
    setMensajeAlerta("⚠️ Debes iniciar sesión para agregar productos al carrito");
    return; // Detiene la función aquí
  }

  // 2. Si sí está logueado, se agrega normalmente:
  const productoExiste = carrito.find(item => item.id === producto.id);
  if (productoExiste) {
    setCarrito(
      carrito.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  } else {
    setCarrito([...carrito, { ...producto, cantidad: 1 }]);
  }

  setMensajeAlerta(`¡${producto.nombre} agregado al carrito!`);
}
  function aumentarCantidad (id){
    setCarrito(
      carrito.map(producto=>
        producto.id ===id?
        {...producto, cantidad: producto.cantidad + 1}
        : producto
      )
    );
  }
  function disminuirCantidad(id){
    setCarrito(
      carrito.map(
        producto => producto.id === id?
        {...producto,cantidad:producto.cantidad -1}
        :producto
      )
      .filter(p=> p.cantidad > 0)
    );
  }
  function eliminarDelCarrito(id){
    setCarrito(carrito.filter(producto=> producto.id !== id));
  }
  function vaciarCarrito(){
    setCarrito([]);
  }
  const totalUnidades = carrito.reduce((acc,p)=>acc + p.cantidad,0);
  useEffect(() => {
  guardarCarrito(carrito);

  // Solo para depuración: muestra el carrito en la consola
  if (carrito.length === 0) {
    console.log("El carrito está vacío");
  } else {
    carrito.forEach(p =>
      console.log(`${p.emoji || "📦"} ${p.nombre} x${p.cantidad} = $${(p.precio * p.cantidad).toLocaleString("es-CL")}`)
    );
    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    console.log(`Total: $${total.toLocaleString("es-CL")}`);
  }
}, [carrito]);

  useEffect(() => {
    // Solo para depuración: muestra el usuario de sesión en la consola
    console.log("Usuario de sesión:", usuario);
  }, [usuario]);
  return (
    <BrowserRouter>
    <BarraNavegacion totalCarrito={totalUnidades} usuario={usuario} onLogout={cerrarSesion}/>



      <main className="layout-wrapper my-5">
        <Routes>
          <Route
          path="/login"
          element={
            usuario ? (
              // Si ya hay sesión, no tiene sentido mostrar el login: volvemos al inicio
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={iniciarSesion} />
            )
          }
          />
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
