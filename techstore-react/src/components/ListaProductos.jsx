import Producto from "./Producto";

function ListaProductos({ productos, mostrarDetalle = true }) {
  return (
    <div className="row g-4">
      {productos.map((producto) => (
        <Producto
          key={producto.id}
          producto={producto}
          mostrarDetalle={mostrarDetalle}
        />
      ))}
    </div>
  );
}

export default ListaProductos;