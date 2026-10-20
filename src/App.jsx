import { useEffect, useState } from "react";
import Footer from "./components/footer";
import BarraNavegacion from "./components/BarraNavegacion";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import CarritoPage from "./pages/CarritoPage";
import { guardarCarrito, obtenerCarrito } from "./utils/localStorage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
function App() {
  // State: recuerda qué página se está mostrando
  
  const [carrito,setCarrito] = useState(obtenerCarrito);
  

  function agregarAlCarrito(producto){
    const productoExiste = carrito.find(item=> item.id === producto.id);

    if (productoExiste){
      setCarrito(
        carrito.map(item=>
          item.id === producto.id?{...item,cantidad : item.cantidad+1}:item
        )
      );
    }else{
      setCarrito([
        ...carrito,{
          ...producto, cantidad:1}
      ]);
    }
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
          element={<Productos agregarAlCarrito={agregarAlCarrito}/>}/>
          <Route
          path="/carrito"
          element={
            <CarritoPage
            carrito={carrito}
            aumentarCantidad={aumentarCantidad}
            disminuirCantidad={disminuirCantidad}
            eliminarDelCarrito={eliminarDelCarrito}
            />
          }
          
          />
          </Routes>
      </main>

      <Footer />
      </BrowserRouter>
  );
}

export default App;
