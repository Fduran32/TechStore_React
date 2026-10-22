import { Link } from "react-router-dom";

function CarritoPage({ carrito, aumentarCantidad, disminuirCantidad, eliminarDelCarrito }){
    const fuenteOrbitron ={fontFamily: "'Orbitron' , sans-serif"};

const total = carrito.reduce(
    (acumulado,producto) => acumulado + producto.precio * producto.cantidad,0
);
if (carrito.length === 0){
    return(
        <div className="py-5 d-flex justify-content-center">
            <div className="card bg-dark text-white border-secondary p-4 shadow-lg text-center" style={{ maxWidth: "420px", width: "100%" }}>
                <h2 style={fuenteOrbitron} className="text-neon-blue mb-4 fw-bold">🛒 Mi Carrito</h2>
                <p className="text-secondary fs-5 mb-4">El carrito está vacío</p>
                <Link to="/productos" className="btn btn-neon w-100 fw-bold py-2" style={fuenteOrbitron}>
                    Ver productos
                </Link>
            </div>
        </div>
    );
}
return(
    <div className="py-4">
        <h2 style={fuenteOrbitron} className="text-neon-blue mb-4">🛒 Mi Carrito de Compras</h2>
    <div className="table-responsive">
        <table className="table table-dark table-hover align-middle border-secondary">
            <thead>
                <tr className="text-secondary small">
                    <th>Producto</th>
                    <th>Precio Unitario</th>
                    <th className="text-center">Cantidad</th>
                    <th>SubTotal</th>
                    <th className="text-center">Accion</th>
                    </tr>
                    </thead>
                    <tbody>
                        {carrito.map((producto)=>(
                            <tr key={producto.id}>
                                <td>
                                    <div className="d-flex align-items-center gap-3">
                                        {producto.imagen &&(
                                            <img
                                            src={producto.imagen}
                                            alt={producto.imagen}
                                            style = {{width:"50px", height:"50px",objectFit:"cover",borderRadius:"8px"}}
                                            />
                        )}
                        <span className="fw-bold">{producto.emoji || "📦"} {producto.nombre}</span>
                        </div>
                        </td>
                        <td>${producto.precio.toLocaleString("es-cl")}</td>
                        <td className="text-center">
                            <div className="btn-group" role="group">
                                <button className="btn btn-outline-danger btn-sm px-2 fw-bold"
                                onClick={()=> disminuirCantidad(producto.id)}
                                >
                                -
                                </button>
                                <span className="btn btn-dark btn-sm px-3 fw-bold disabled border-secondary">
                                    {producto.cantidad}
                                    </span>
                                    <button
                                     className="btn btn-outline-success btn-sm px-2 fw-bold"
                                    onClick={()=> aumentarCantidad(producto.id)}
                                    >
                                    +
                                    </button>
                                    </div>
                                    </td>
                                    <td className="fw-bold text-neon-blue">
                                        ${(producto.precio*producto.cantidad).toLocaleString("es-CL")}
                                        </td>
                                        <td className="text-center">
                                            <button
                                            className="btn btn-danger btn-sm"
                                            onClick={()=> eliminarDelCarrito(producto.id)}
                                            > 🗑️ Eliminar
                                            </button>
                                            </td>
                                            </tr>
 ) )}
 </tbody>
 </table>
 </div>
        <div className="d-flex justify-content-end align-items-center gap-3 mt-4 p-3 bg-dark border border-secondary rounded">
            <h3 className="mb-0 fw-bold" style={fuenteOrbitron}>Total a pagar: <span className="text-neon-blue">${total.toLocaleString("es-CL")}
                </span>
                </h3>
                </div>
                </div>
                );
}
export default CarritoPage;
