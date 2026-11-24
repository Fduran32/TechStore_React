// El carrito se guarda por usuario (carrito_<rut>): sobrevive al cierre de sesión o a la
// expiración del token, y no se mezcla si otra persona inicia sesión en el mismo navegador.
function claveCarrito(rut) {
  return `carrito_${rut}`;
}

export function obtenerCarrito(rut) {
  if (!rut) return [];
  try {
    return JSON.parse(localStorage.getItem(claveCarrito(rut))) || [];
  } catch {
    return [];
  }
}

export function guardarCarrito(carrito, rut) {
  if (!rut) return;
  localStorage.setItem(claveCarrito(rut), JSON.stringify(carrito));
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
