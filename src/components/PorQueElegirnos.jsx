function PorQueElegirnos() {
  const fuenteOrbitron = { fontFamily: "'Orbitron', sans-serif" };

  return (
    <section className="mb-5">
      <h2 className="text-center mb-4" style={fuenteOrbitron}>¿Por qué elegirnos?</h2>

      <div className="row g-4 text-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="p-4 border border-secondary rounded-0 bg-dark text-white h-100 shadow-sm">
            <h3 className="h5 mt-2 text-neon-blue" style={fuenteOrbitron}>Envío Rápido</h3>
            <p className="text-secondary mb-0" style={fuenteOrbitron}>Despachos a todo el país en tiempo récord.</p>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="p-4 border border-secondary rounded-0 bg-dark text-white h-100 shadow-sm">
            <h3 className="h5 mt-2 text-neon-blue" style={fuenteOrbitron}>Garantía Oficial</h3>
            <p className="text-secondary mb-0" style={fuenteOrbitron}>Todos nuestros productos cuentan con garantía directa.</p>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-4">
          <div className="p-4 border border-secondary rounded-0 bg-dark text-white h-100 shadow-sm">
            <h3 className="h5 mt-2 text-neon-blue" style={fuenteOrbitron}>Pago Seguro</h3>
            <p className="text-secondary mb-0" style={fuenteOrbitron}>Múltiples medios de pago de forma rápida y segura.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PorQueElegirnos;