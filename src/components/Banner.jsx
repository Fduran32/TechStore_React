import Carousel from "react-bootstrap/Carousel";

function Banner() {
  const base = import.meta.env.BASE_URL;

  return (
    <section className="mb-5">
      <Carousel interval={3500} className="border border-secondary shadow-lg overflow-hidden">
        <Carousel.Item>
          <img src={`${base}img/banner2.jpg`} className="d-block w-100 banner-img" alt="Banner Principal" />
        </Carousel.Item>
        <Carousel.Item>
          <img src={`${base}img/cyber2.jpg`} className="d-block w-100 banner-img" alt="Ofertas Especiales" />
        </Carousel.Item>
        <Carousel.Item>
          <img src={`${base}img/envio3.jpg`} className="d-block w-100 banner-img" alt="Envío Rápido" />
        </Carousel.Item>
      </Carousel>
    </section>
  );
}

export default Banner;