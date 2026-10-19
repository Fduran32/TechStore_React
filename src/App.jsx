import { useState } from "react";
import Footer from "./components/footer";
import BarraNavegacion from "./components/BarraNavegacion";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";

function App() {
  // State: recuerda qué página se está mostrando
  const [pagina, setPagina] = useState("inicio");

  return (
    <>
      <BarraNavegacion paginaActual={pagina} cambiarPagina={setPagina} />

      <main className="container my-5">
        {pagina === "inicio" && <Inicio />}
        {pagina === "productos" && <Productos />}
      </main>

      <Footer />
    </>
  );
}

export default App;