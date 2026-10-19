import Carousel from "react-bootstrap/Carousel";

function Banner() {
  return (
    <section className="mb-5">
      <Carousel interval={3500} className="border border-secondary shadow-lg overflow-hidden">
        <Carousel.Item>
          <img src="/img/banner2.jpg" className="d-block w-100 banner-img" alt="Banner Principal" />
        </Carousel.Item>
        <Carousel.Item>
          <img src="/img/cyber2.jpg" className="d-block w-100 banner-img" alt="Ofertas Especiales" />
        </Carousel.Item>
        <Carousel.Item>
          <img src="/img/envio3.jpg" className="d-block w-100 banner-img" alt="Envío Rápido" />
        </Carousel.Item>
      </Carousel>
    </section>
  );
}

export default Banner;