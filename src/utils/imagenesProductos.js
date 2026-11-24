const base = import.meta.env.BASE_URL;
const ruta = (archivo) => `${base}img/productos/${archivo}.jpg`;

function normalizar(texto) {
  return (texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Imagen real de cada producto, según su nombre en la BD (normalizado)
const imagenesPorNombre = {
  "logitech g502 hero": ruta("logitech-g502-hero"),
  "razer deathadder v3": ruta("razer-deathadder-v3"),
  "logitech mx master 3s": ruta("logitech-mx-master-3s"),
  "hyperx alloy origins": ruta("hyperx-alloy-origins"),
  "redragon kumara k552": ruta("redragon-kumara-k552"),
  "logitech mx keys s": ruta("logitech-mx-keys-s"),
  "hyperx cloud ii": ruta("hyperx-cloud-ii"),
  "logitech g pro x": ruta("logitech-g-pro-x"),
  "razer blackshark v2 x": ruta("razer-blackshark-v2-x"),
  "samsung odyssey g5 27": ruta("samsung-odyssey-g5-27"),
  "lg ultragear 27gn750": ruta("lg-ultragear-27gn750"),
  "logitech c920 hd pro": ruta("logitech-c920-hd-pro"),
  "razer kiyo": ruta("razer-kiyo"),
  "hyperx quadcast s": ruta("hyperx-quadcast-s"),
  "logitech g240": ruta("logitech-g240"),
};

// Respaldo para productos nuevos que aún no tienen imagen propia
const imagenesPorCategoria = {
  mouse: `${base}img/mouse.jpg`,
  teclado: `${base}img/teclado.jpg`,
  audifonos: `${base}img/audifonos.jpg`,
  monitor: `${base}img/monitor.webp`,
  mousepad: `${base}img/mousepad.webp`,
  "camara web": ruta("logitech-c920-hd-pro"),
  microfono: ruta("hyperx-quadcast-s"),
};

// Prioridad: nombre > imagen propia del producto > categoría > genérica
export function obtenerImagenProducto(producto) {
  return (
    imagenesPorNombre[normalizar(producto.nombre)] ||
    producto.imagen ||
    imagenesPorCategoria[normalizar(producto.categoria)] ||
    `${base}img/teclado.jpg`
  );
}
