import Head from 'next/head';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!location.trim() || !pickupDate || !dropoffDate) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (new Date(dropoffDate) < new Date(pickupDate)) {
      setError('La fecha de devolución no puede ser menor a la fecha de recogida.');
      return;
    }

    setError('');

    router.push({
      pathname: '/results',
      query: {
        location,
        pickup: pickupDate,
        dropoff: dropoffDate,
      },
    });
  };

  const today = new Date().toISOString().split('T')[0];
  return (
    <>
      <Head>
        <title>Outlet Rental Cars | Búsqueda de vehículos</title>
        <meta
          name="description"
          content="Flujo de búsqueda y selección de vehículos para Outlet Rental Cars"
        />
      </Head>

      <main className="orc-page">
        <div className="orc-container">
          <header className="orc-topbar">
            <div className="orc-logo">
              <div className="orc-logo-title">outlet</div>
              <div className="orc-logo-subtitle">by miles car rental</div>
            </div>

            <div className="orc-chip">Ofertas exclusivas en renta de autos</div>
          </header>

          <section className="orc-hero">
            <div className="orc-hero-content">
              <div className="orc-eyebrow">Renta de autos en destinos populares</div>
                <h1 className="orc-title">
                  Encuentra el auto perfecto para viajar con comodidad y al mejor precio
                </h1>
                <p className="orc-description">
                  Reserva vehículos en aeropuertos y ciudades principales de Estados Unidos.
                  Compara opciones, consulta disponibilidad en segundos y elige la alternativa
                  que mejor se adapte a tu itinerario, presupuesto y estilo de viaje.
                </p>
            </div>

            <div className="orc-hero-card">
              <div className="orc-hero-card-content">
                <span className="orc-hero-card-badge">Hasta 40% de descuento</span>
                <h2 className="orc-hero-card-title">Las mejores tarifas para tu próximo recorrido</h2>
                <p className="orc-hero-card-text">
                  Encuentra autos compactos, SUVs y convertibles con tarifas competitivas,
                  recogida en ubicaciones estratégicas y la flexibilidad que necesitas para
                  disfrutar tu viaje sin complicaciones.
                </p>
              </div>
            </div>
          </section>

          <section className="orc-search-box" aria-labelledby="search-box-title">
            <h2 id="search-box-title" className="orc-search-heading">
              Busca aquí
            </h2>
            <p className="orc-search-subtext">
              Ingresa tu destino y selecciona las fechas de recogida y devolución para ver las opciones disponibles.
            </p>

            <form onSubmit={handleSubmit} aria-label="Formulario de búsqueda de vehículos">
              <div className="orc-search-grid">
                <div className="orc-field">
                  <label htmlFor="location" className="orc-label">
                    Ciudad o aeropuerto
                  </label>
                  <input
                    id="location"
                    type="text"
                    className="orc-input"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Ej: Aeropuerto Internacional de Miami"
                  />
                </div>

                <div className="orc-field">
                  <label htmlFor="pickupDate" className="orc-label">
                    Recogida
                  </label>
                  <input
                    id="pickupDate"
                    type="date"
                    className="orc-input"
                    value={pickupDate}
                    min={today}
                    onChange={(event) => setPickupDate(event.target.value)}
                  />
                </div>

                <div className="orc-field">
                  <label htmlFor="dropoffDate" className="orc-label">
                    Devolución
                  </label>
                  <input
                    id="dropoffDate"
                    type="date"
                    className="orc-input"
                    value={dropoffDate}
                    min={pickupDate || today}
                    onChange={(event) => setDropoffDate(event.target.value)}
                  />
                </div>

                <button type="submit" className="orc-button orc-button-primary">
                  Buscar
                </button>
              </div>

              {error && (
                <p role="alert" className="orc-error">
                  {error}
                </p>
              )}
            </form>
          </section>

          <section className="orc-features" aria-label="Beneficios principales">
            <article className="orc-feature-card">
              <h3 className="orc-feature-title">Tarifas competitivas</h3>
              <p className="orc-feature-text">
                Accede a precios especiales y promociones en múltiples categorías de vehículos.
              </p>
            </article>

            <article className="orc-feature-card">
              <h3 className="orc-feature-title">Recogida en aeropuertos y ciudades</h3>
              <p className="orc-feature-text">
                Encuentra opciones disponibles en ubicaciones clave para iniciar tu viaje con facilidad.
              </p>
            </article>

            <article className="orc-feature-card">
              <h3 className="orc-feature-title">Reserva con total claridad</h3>
              <p className="orc-feature-text">
                Consulta precio estimado, duración del alquiler y detalles de tu selección en un solo lugar.
              </p>
            </article>
          </section>
        </div>
      </main>
    </>
  );
}