const CLAVE_CARRITO = "carrito";

export function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
  } catch {
    return [];
  }
}

export function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// Historial de compras asociadas al usuario conectado
export function obtenerCompras(usuario) {
  try {
    const clave = usuario ? `compras_${usuario}` : "compras";
    return JSON.parse(localStorage.getItem(clave)) || [];
  } catch {
    return [];
  }
}

export function guardarCompra(compra, usuario) {
  const clave = usuario ? `compras_${usuario}` : "compras";
  const comprasActuales = obtenerCompras(usuario);
  const nuevasCompras = [compra, ...comprasActuales]; // Orden descendente (la más reciente primero)
  localStorage.setItem(clave, JSON.stringify(nuevasCompras));
  return nuevasCompras;
}
