function Footer() {
  // Guardamos el estilo en una variable para no repetirlo 3 veces
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };  // 👈

  return (
    <footer className="bg-dark text-white py-4 mt-5 border-top border-secondary">  {/* 👈 className */}
      <div className="layout-wrapper">
        <p className="mb-3 text-secondary" style={fuenteOrbitron}>  {/* 👈 style como objeto */}
          Visita nuestras redes sociales:
        </p>

        <div className="d-flex gap-4 mb-3 fs-3">
          <a href="https://www.whatsapp.com" target="_blank" rel="noreferrer" className="text-white text-neon-hover" aria-label="WhatsApp">
            <i className="bi bi-whatsapp"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="text-white text-neon-hover" aria-label="Instagram">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://tiktok.com/" target="_blank" rel="noreferrer" className="text-white text-neon-hover" aria-label="TikTok">
            <i className="bi bi-tiktok"></i>
          </a>
        </div>

        <p className="mb-3 text-secondary" style={fuenteOrbitron}>
          &copy; 2026 TechStore - Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;