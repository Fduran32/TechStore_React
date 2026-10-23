# 🧪 Guía de Comandos para Ejecutar Pruebas (Vitest y Chromium)
**Proyecto:** TechStore React  
**Herramientas:** Vitest, React Testing Library, Playwright y Chromium

---

## 📌 1. Pruebas Unitarias de a Una (por archivo)

Ejecutan pruebas rápidas en memoria (entorno `jsdom`) para verificar componentes y lógica aislada sin abrir ventanas del navegador.

---

### 1️⃣ Probar solo el Inicio de Sesión (Login)
* **Comando:**
  ```bash
  npx vitest run src/pages/Login.test.jsx
  ```
* **¿Qué prueba este archivo?**
  * Verifica que el formulario de Login renderice correctamente.
  * Comprueba la presencia del campo `Usuario`, el campo `Contraseña` y el botón `Ingresar`.

---

### 2️⃣ Probar solo el Componente Producto
* **Comando:**
  ```bash
  npx vitest run src/components/Producto.test.jsx
  ```
* **¿Qué prueba este archivo?**
  * Verifica que la tarjeta del producto muestre el nombre, imagen, descripción y precio formateado en pesos chilenos (`$45.000`).
  * Simula un clic en el botón `Añadir al Carrito` y comprueba que se llame a la función correspondiente con los datos exactos del producto.

---

### 3️⃣ Probar solo la Página del Carrito (CarritoPage)
* **Comando:**
  ```bash
  npx vitest run src/pages/CarritoPage.test.jsx
  ```
* **¿Qué prueba este archivo?**
  * **Estado vacío:** Verifica que muestre el mensaje *"El carrito está vacío"* cuando no hay elementos.
  * **Con productos:** Comprueba que aparezcan los productos en la tabla, el cálculo automático de subtotales y el total a pagar.
  * **Interacciones:** Simula clics en el botón de aumento (`+`), disminución (`-`), eliminación (`🗑️ Eliminar`) y verifica la presencia del botón `💳 Pagar`.

---

### 4️⃣ Probar solo el Historial de Compras (MisCompras)
* **Comando:**
  ```bash
  npx vitest run src/pages/MisCompras.test.jsx
  ```
* **¿Qué prueba este archivo?**
  * **Estado inicial:** Verifica el mensaje cuando el usuario aún no tiene compras registradas.
  * **Acumulación de compras:** Comprueba que al registrar múltiples órdenes (ej: orden 1 y orden 2), la página renderice ambas tarjetas con su fecha, número de orden, detalle de productos y total pagado.

---

## 🌐 2. Pruebas de Navegador con Chromium (Playwright)

Abren un navegador real basado en Chrome para probar la interacción visual de la persona usuaria, navegación entre páginas y persistencia de sesión.

---

### 5️⃣ Ejecutar Pruebas en Chromium en Modo Visual (Interactivo)
* **Comando:**
  ```bash
  npm run test:browser
  ```
* **¿Qué prueba este comando?**
  * Abre una ventana real de **Chromium** en tu pantalla gracias a Playwright.
  * Ejecuta todos los archivos `*.browser.test.jsx`:
    * **`Login.browser.test.jsx` (Casos PF-01 a PF-04):** Muestra el formulario, simula que el usuario escribe credenciales válidas e inválidas, verifica el guardado de la sesión en `sessionStorage` y la redirección a la ruta principal.
    * **`CarritoPage.browser.test.jsx` (Casos PF-10 a PF-15):** Prueba en el navegador que los botones `+`, `-` y `Eliminar` respondan, y que el total se calcule correctamente.
* **¿Cómo salir?** Presiona la tecla `q` o `Ctrl + C` en la terminal.

---

### 💡 Alternativa: Ejecutar Chromium una sola vez y cerrar automático
* **Comando:**
  ```bash
  npx vitest run --config ./vitest.browser.config.js
  ```
  *(Corre las 10 pruebas de Chromium en consola, muestra el reporte final y termina solo).*

---

## 🚀 3. Ejecutar TODAS las Pruebas Unitarias Juntas
* **Comando:**
  ```bash
  npx vitest run
  ```
  *(Ejecuta todas las 17 pruebas unitarias de los 6 archivos del proyecto en pocos segundos).*
