import { useEffect, useState } from "react";
import clienteAxios from "../services/axiosConfig";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

function InventarioPage({ rol }) {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };
  const base = import.meta.env.BASE_URL;

  // Estados de productos y carga
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("TODAS");

  // Alerta de feedback (éxito / error)
  const [alerta, setAlerta] = useState(null); // { tipo: 'success' | 'danger', mensaje: '' }

  // Estados para modales
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalStock, setModalStock] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  // Estados de datos de formularios
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formCrear, setFormCrear] = useState({
    nombre: "",
    descripcion: "",
    categoria: "Mouse",
    precio: "",
    stock: "",
  });
  const [formEditar, setFormEditar] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
    stock: "",
  });
  const [nuevoStock, setNuevoStock] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Mapeo automático de imágenes locales según la categoría
  const mapaImagenes = {
    mouse: `${base}img/mouse.jpg`,
    teclado: `${base}img/teclado.jpg`,
    "audífonos": `${base}img/audifonos.jpg`,
    audifonos: `${base}img/audifonos.jpg`,
    monitor: `${base}img/monitor.webp`,
    mousepad: `${base}img/mousepad.webp`,
    "cámara web": `${base}img/cyber.jpg`,
    camara: `${base}img/cyber.jpg`,
    "micrófono": `${base}img/cyber2.jpg`,
    microfono: `${base}img/cyber2.jpg`,
  };

  const categoriasDisponibles = [
    "Mouse",
    "Teclado",
    "Audífonos",
    "Monitor",
    "Mousepad",
    "Cámara Web",
    "Micrófono",
    "Accesorios",
  ];

  // Cargar productos al montar
  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      setCargando(true);
      console.log("[INFO][INVENTARIO] Obteniendo lista de productos (GET /api/productos)...");
      const res = await clienteAxios.get("/api/productos");

      const lista = res.data.map((p) => {
        const catNorm = (p.categoria || "").toLowerCase().trim();
        const img = p.imagen || mapaImagenes[catNorm] || `${base}img/teclado.jpg`;
        return { ...p, imagen: img };
      });

      setProductos(lista);
    } catch (err) {
      console.error("[ERROR][INVENTARIO] Error al cargar productos:", err);
      mostrarAlerta("danger", "No se pudo cargar el inventario desde el servidor.");
    } finally {
      setCargando(false);
    }
  }

  function mostrarAlerta(tipo, mensaje) {
    setAlerta({ tipo, mensaje });
    setTimeout(() => {
      setAlerta(null);
    }, 4000);
  }

  // --- CREAR PRODUCTO (POST) ---
  function abrirModalCrear() {
    setFormCrear({
      nombre: "",
      descripcion: "",
      categoria: "Mouse",
      precio: "",
      stock: "",
    });
    setModalCrear(true);
  }

  async function handleCrearProducto(e) {
    e.preventDefault();
    if (!formCrear.nombre.trim() || !formCrear.precio || formCrear.stock === "") {
      mostrarAlerta("danger", "Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      setGuardando(true);
      const payload = {
        nombre: formCrear.nombre.trim(),
        descripcion: formCrear.descripcion.trim(),
        categoria: formCrear.categoria.trim(),
        precio: parseInt(formCrear.precio, 10),
        stock: parseInt(formCrear.stock, 10),
      };

      console.log("[INFO][INVENTARIO] Creando nuevo producto (POST /api/productos):", payload);
      await clienteAxios.post("/api/productos", payload);

      setModalCrear(false);
      mostrarAlerta("success", `¡Producto "${payload.nombre}" creado exitosamente!`);
      await cargarProductos();
    } catch (err) {
      console.error("[ERROR][INVENTARIO] Error al crear producto:", err);
      const msg = err.response?.data?.message || "Error al crear el producto en el servidor.";
      mostrarAlerta("danger", msg);
    } finally {
      setGuardando(false);
    }
  }

  // --- EDITAR PRODUCTO (PUT) ---
  function abrirModalEditar(prod) {
    setProductoSeleccionado(prod);
    setFormEditar({
      nombre: prod.nombre || "",
      descripcion: prod.descripcion || "",
      categoria: prod.categoria || "Mouse",
      precio: prod.precio || "",
      stock: prod.stock !== undefined ? prod.stock : "",
    });
    setModalEditar(true);
  }

  async function handleEditarProducto(e) {
    e.preventDefault();
    if (!productoSeleccionado) return;

    try {
      setGuardando(true);
      const payload = {
        nombre: formEditar.nombre.trim(),
        descripcion: formEditar.descripcion.trim(),
        categoria: formEditar.categoria.trim(),
        precio: parseInt(formEditar.precio, 10),
        stock: parseInt(formEditar.stock, 10),
      };

      console.log(`[INFO][INVENTARIO] Actualizando producto ID ${productoSeleccionado.id} (PUT /api/productos/${productoSeleccionado.id}):`, payload);
      await clienteAxios.put(`/api/productos/${productoSeleccionado.id}`, payload);

      setModalEditar(false);
      mostrarAlerta("success", `Producto "${payload.nombre}" actualizado correctamente.`);
      await cargarProductos();
    } catch (err) {
      console.error("[ERROR][INVENTARIO] Error al editar producto:", err);
      const msg = err.response?.data?.message || "Error al actualizar el producto.";
      mostrarAlerta("danger", msg);
    } finally {
      setGuardando(false);
    }
  }

  // --- AJUSTAR STOCK (PATCH) ---
  function abrirModalStock(prod) {
    setProductoSeleccionado(prod);
    setNuevoStock(prod.stock !== undefined ? prod.stock : 0);
    setModalStock(true);
  }

  async function handleAjustarStock(e) {
    e.preventDefault();
    if (!productoSeleccionado) return;

    try {
      setGuardando(true);
      const stockNum = parseInt(nuevoStock, 10);
      if (isNaN(stockNum) || stockNum < 0) {
        mostrarAlerta("danger", "El stock debe ser un número igual o mayor a 0.");
        return;
      }

      console.log(`[INFO][INVENTARIO] Ajustando stock de ID ${productoSeleccionado.id} a ${stockNum} (PATCH /api/productos/${productoSeleccionado.id}/stock)`);
      await clienteAxios.patch(`/api/productos/${productoSeleccionado.id}/stock`, {
        stock: stockNum,
      });

      setModalStock(false);
      mostrarAlerta("success", `Stock de "${productoSeleccionado.nombre}" actualizado a ${stockNum} unidades.`);
      await cargarProductos();
    } catch (err) {
      console.error("[ERROR][INVENTARIO] Error al ajustar stock:", err);
      const msg = err.response?.data?.message || "Error al actualizar el stock.";
      mostrarAlerta("danger", msg);
    } finally {
      setGuardando(false);
    }
  }

  // --- ELIMINAR PRODUCTO (DELETE - Solo ADMIN) ---
  function abrirModalEliminar(prod) {
    setProductoSeleccionado(prod);
    setModalEliminar(true);
  }

  async function handleEliminarProducto() {
    if (!productoSeleccionado) return;

    try {
      setGuardando(true);
      console.log(`[INFO][INVENTARIO] Eliminando producto ID ${productoSeleccionado.id} (DELETE /api/productos/${productoSeleccionado.id})`);
      await clienteAxios.delete(`/api/productos/${productoSeleccionado.id}`);

      setModalEliminar(false);
      mostrarAlerta("success", `Producto "${productoSeleccionado.nombre}" eliminado correctamente.`);
      await cargarProductos();
    } catch (err) {
      console.error("[ERROR][INVENTARIO] Error al eliminar producto:", err);
      const msg = err.response?.data?.message || "No se pudo eliminar el producto.";
      mostrarAlerta("danger", msg);
    } finally {
      setGuardando(false);
    }
  }

  // Filtros de búsqueda en memoria
  const productosFiltrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
    const coincideCategoria = filtroCategoria === "TODAS" || p.categoria?.toLowerCase() === filtroCategoria.toLowerCase();
    return coincideNombre && coincideCategoria;
  });

  const esAdmin = rol === "ADMINISTRADOR";

  return (
    <div className="container py-3">
      {/* Cabecera de la Página */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 border-bottom border-secondary pb-3">
        <div>
          <h1 className="text-neon-blue mb-1" style={fuenteOrbitron}>
            📦 Gestión de Inventario
          </h1>
          <p className="text-secondary mb-0 small">
            Administración centralizada de catálogo, precios y existencias en MySQL
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className={`badge px-3 py-2 ${esAdmin ? "bg-danger" : "bg-warning text-dark"}`}>
            Rol: {rol || "VENDEDOR"}
          </span>
          <button
            className="btn btn-outline-info fw-bold d-flex align-items-center gap-1 shadow-sm"
            onClick={abrirModalCrear}
          >
            ➕ Nuevo Producto
          </button>
        </div>
      </div>

      {/* Alerta flotante o fija */}
      {alerta && (
        <Alert variant={alerta.tipo} dismissible onClose={() => setAlerta(null)} className="shadow">
          {alerta.mensaje}
        </Alert>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="row g-2 mb-4 bg-dark p-3 rounded border border-secondary align-items-center">
        <div className="col-12 col-md-6">
          <input
            type="text"
            className="form-control bg-dark text-white border-secondary"
            placeholder="🔍 Buscar por nombre o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select bg-dark text-white border-secondary"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="TODAS">Todas las categorías</option>
            {categoriasDisponibles.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-2 text-md-end text-secondary small">
          Total: <strong className="text-neon-blue">{productosFiltrados.length}</strong> items
        </div>
      </div>

      {/* Indicador de carga */}
      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-secondary mt-2" style={fuenteOrbitron}>
            Sincronizando inventario con la base de datos...
          </p>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="alert alert-secondary text-center py-5">
          <h4 style={fuenteOrbitron}>No se encontraron productos</h4>
          <p className="mb-0 text-muted">Intenta con otro término de búsqueda o categoría.</p>
        </div>
      ) : (
        /* Tabla de Productos */
        <div className="table-responsive rounded border border-secondary shadow">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead className="table-secondary text-dark small text-uppercase">
              <tr>
                <th style={{ width: "60px" }}>ID</th>
                <th style={{ width: "70px" }}>Foto</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio Unitario</th>
                <th className="text-center">Stock</th>
                <th className="text-center" style={{ width: "230px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((prod) => {
                const stockColor =
                  prod.stock <= 0 ? "bg-danger" : prod.stock < 5 ? "bg-warning text-dark" : "bg-success";
                const stockTexto =
                  prod.stock <= 0 ? "Agotado (0)" : `${prod.stock} unids.`;

                return (
                  <tr key={prod.id}>
                    <td className="text-secondary fw-semibold">#{prod.id}</td>
                    <td>
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        style={{
                          width: "48px",
                          height: "48px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid rgba(0, 243, 255, 0.3)",
                        }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-white">{prod.nombre}</div>
                      {prod.descripcion && (
                        <div className="text-secondary small text-truncate" style={{ maxWidth: "280px" }}>
                          {prod.descripcion}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-secondary">{prod.categoria}</span>
                    </td>
                    <td className="fw-bold text-neon-blue">
                      ${prod.precio.toLocaleString("es-CL")}
                    </td>
                    <td className="text-center">
                      <span className={`badge ${stockColor} px-2 py-1`}>
                        {stockTexto}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          type="button"
                          className="btn btn-outline-info"
                          title="Editar producto completo"
                          onClick={() => abrirModalEditar(prod)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-warning"
                          title="Ajuste rápido de stock"
                          onClick={() => abrirModalStock(prod)}
                        >
                          🔢 Stock
                        </button>
                        <button
                          type="button"
                          className={`btn ${esAdmin ? "btn-outline-danger" : "btn-outline-secondary disabled"}`}
                          title={esAdmin ? "Eliminar producto de MySQL" : "Solo Administradores pueden eliminar"}
                          onClick={() => esAdmin && abrirModalEliminar(prod)}
                          disabled={!esAdmin}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. MODAL: CREAR PRODUCTO                                */}
      {/* ======================================================== */}
      <Modal show={modalCrear} onHide={() => setModalCrear(false)} centered data-bs-theme="dark">
        <Modal.Header closeButton className="border-secondary bg-dark">
          <Modal.Title style={fuenteOrbitron} className="text-neon-blue fs-5">
            ➕ Crear Nuevo Producto
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCrearProducto}>
          <Modal.Body className="bg-dark text-white">
            <Form.Group className="mb-3">
              <Form.Label className="small text-secondary">Nombre del Producto *</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Ej: Teclado Mecánico RGB"
                value={formCrear.nombre}
                onChange={(e) => setFormCrear({ ...formCrear, nombre: e.target.value })}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <Form.Label className="small text-secondary">Categoría *</Form.Label>
                <Form.Select
                  value={formCrear.categoria}
                  onChange={(e) => setFormCrear({ ...formCrear, categoria: e.target.value })}
                  className="bg-dark text-white border-secondary"
                >
                  {categoriasDisponibles.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-6">
                <Form.Label className="small text-secondary">Precio ($CLP) *</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  required
                  placeholder="39990"
                  value={formCrear.precio}
                  onChange={(e) => setFormCrear({ ...formCrear, precio: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="small text-secondary">Stock Inicial *</Form.Label>
              <Form.Control
                type="number"
                min="0"
                required
                placeholder="10"
                value={formCrear.stock}
                onChange={(e) => setFormCrear({ ...formCrear, stock: e.target.value })}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small text-secondary">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Detalles técnicos, switches, conectividad..."
                value={formCrear.descripcion}
                onChange={(e) => setFormCrear({ ...formCrear, descripcion: e.target.value })}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-secondary bg-dark">
            <Button variant="outline-secondary" onClick={() => setModalCrear(false)}>
              Cancelar
            </Button>
            <Button variant="info" type="submit" disabled={guardando} className="fw-bold">
              {guardando ? "Guardando..." : "Guardar Producto"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ======================================================== */}
      {/* 2. MODAL: EDITAR PRODUCTO                                */}
      {/* ======================================================== */}
      <Modal show={modalEditar} onHide={() => setModalEditar(false)} centered data-bs-theme="dark">
        <Modal.Header closeButton className="border-secondary bg-dark">
          <Modal.Title style={fuenteOrbitron} className="text-neon-blue fs-5">
            ✏️ Editar Producto #{productoSeleccionado?.id}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditarProducto}>
          <Modal.Body className="bg-dark text-white">
            <Form.Group className="mb-3">
              <Form.Label className="small text-secondary">Nombre del Producto *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formEditar.nombre}
                onChange={(e) => setFormEditar({ ...formEditar, nombre: e.target.value })}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <Form.Label className="small text-secondary">Categoría *</Form.Label>
                <Form.Select
                  value={formEditar.categoria}
                  onChange={(e) => setFormEditar({ ...formEditar, categoria: e.target.value })}
                  className="bg-dark text-white border-secondary"
                >
                  {categoriasDisponibles.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-6">
                <Form.Label className="small text-secondary">Precio ($CLP) *</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  required
                  value={formEditar.precio}
                  onChange={(e) => setFormEditar({ ...formEditar, precio: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="small text-secondary">Stock Actual *</Form.Label>
              <Form.Control
                type="number"
                min="0"
                required
                value={formEditar.stock}
                onChange={(e) => setFormEditar({ ...formEditar, stock: e.target.value })}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small text-secondary">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formEditar.descripcion}
                onChange={(e) => setFormEditar({ ...formEditar, descripcion: e.target.value })}
                className="bg-dark text-white border-secondary"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-secondary bg-dark">
            <Button variant="outline-secondary" onClick={() => setModalEditar(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={guardando} className="fw-bold">
              {guardando ? "Actualizando..." : "Actualizar Cambios"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ======================================================== */}
      {/* 3. MODAL: AJUSTAR STOCK RÁPIDO                            */}
      {/* ======================================================== */}
      <Modal show={modalStock} onHide={() => setModalStock(false)} centered size="sm" data-bs-theme="dark">
        <Modal.Header closeButton className="border-secondary bg-dark">
          <Modal.Title style={fuenteOrbitron} className="text-warning fs-6">
            🔢 Ajustar Stock
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAjustarStock}>
          <Modal.Body className="bg-dark text-white">
            <p className="small text-secondary mb-2">
              Producto: <strong className="text-white">{productoSeleccionado?.nombre}</strong>
            </p>
            <Form.Group className="mb-2">
              <Form.Label className="small text-secondary">Nuevo Stock en Inventario:</Form.Label>
              <Form.Control
                type="number"
                min="0"
                required
                value={nuevoStock}
                onChange={(e) => setNuevoStock(e.target.value)}
                className="bg-dark text-white border-secondary fs-5 text-center fw-bold text-warning"
                autoFocus
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-secondary bg-dark">
            <Button variant="outline-secondary" size="sm" onClick={() => setModalStock(false)}>
              Cancelar
            </Button>
            <Button variant="warning" size="sm" type="submit" disabled={guardando} className="fw-bold">
              {guardando ? "Guardando..." : "Guardar Stock"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ======================================================== */}
      {/* 4. MODAL: CONFIRMAR ELIMINACIÓN (ADMIN)                  */}
      {/* ======================================================== */}
      <Modal show={modalEliminar} onHide={() => setModalEliminar(false)} centered data-bs-theme="dark">
        <Modal.Header closeButton className="border-secondary bg-dark">
          <Modal.Title style={fuenteOrbitron} className="text-danger fs-5">
            ⚠️ Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <p className="mb-2">
            ¿Estás seguro de que deseas eliminar permanentemente este producto del catálogo?
          </p>
          <div className="alert alert-dark border-danger text-center">
            <strong className="text-danger">{productoSeleccionado?.nombre}</strong> (ID: #{productoSeleccionado?.id})
          </div>
          <p className="small text-secondary mb-0">
            Esta acción eliminará el registro directamente de la base de datos MySQL y no se puede deshacer.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-secondary bg-dark">
          <Button variant="outline-secondary" onClick={() => setModalEliminar(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminarProducto} disabled={guardando} className="fw-bold">
            {guardando ? "Eliminando..." : "Sí, Eliminar de MySQL"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default InventarioPage;
