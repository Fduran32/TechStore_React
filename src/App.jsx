import { useEffect, useState } from "react";
import Footer from "./components/footer";
import BarraNavegacion from "./components/BarraNavegacion";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import CarritoPage from "./pages/CarritoPage";
import { guardarCarrito, obtenerCarrito } from "./utils/localStorage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  // State: recuerda qué página se está mostrando
  
  const [carrito,setCarrito] = useState(obtenerCarrito);
  const [mensajeAlerta, setMensajeAlerta] = useState(null);

  function agregarAlCarrito(producto) {
  // 1. Verificamos si hay usuario conectado
  const usuario = sessionStorage.getItem("usuario");

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
  const totalUnidades = carrito.reduce((acc,p)=>acc + p.cantidad,0);
  useEffect(() => {
  guardarCarrito(carrito);
}, [carrito]);
  return (
    <BrowserRouter>
    <BarraNavegacion totalCarrito={totalUnidades}/>
    
      

      <main className="container my-5">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Inicio/>}/>
          <Route
          path="/productos"
          element={
            
          <Productos agregarAlCarrito={agregarAlCarrito}/>}
        
          />
          <Route
          path="/carrito"
          element={
            <ProtectedRoute>
            <CarritoPage
            carrito={carrito}
            aumentarCantidad={aumentarCantidad}
            disminuirCantidad={disminuirCantidad}
            eliminarDelCarrito={eliminarDelCarrito}
            />
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
