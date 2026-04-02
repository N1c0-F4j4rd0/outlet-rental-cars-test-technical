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

            <div className="orc-chip">Reserva fácil y rápida</div>
          </header>

          <section className="orc-hero">
            <div className="orc-hero-content">
              <div className="orc-eyebrow">Outlet Rental Cars</div>
              <h1 className="orc-title">
                Encuentra el vehículo ideal para tu próximo viaje
              </h1>
              <p className="orc-description">
                Consulta disponibilidad por ciudad o aeropuerto, elige tus fechas y
                revisa resultados con una experiencia moderna, clara y alineada al
                estilo visual de Outlet Rental Cars.
              </p>
            </div>

            <div className="orc-hero-card">
              <div className="orc-hero-card-content">
                <span className="orc-hero-card-badge">Hasta 40% de descuento</span>
                <h2 className="orc-hero-card-title">Reserva con una experiencia más visual</h2>
                <p className="orc-hero-card-text">
                  Flujo de búsqueda, resultados y resumen de reserva con foco en UX,
                  claridad visual y mantenibilidad del código.
                </p>
              </div>
            </div>
          </section>

          <section className="orc-search-box" aria-labelledby="search-box-title">
            <h2 id="search-box-title" className="orc-search-heading">
              Busca aquí
            </h2>
            <p className="orc-search-subtext">
              Completa la información para consultar vehículos disponibles.
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
              <h3 className="orc-feature-title">Búsqueda simple</h3>
              <p className="orc-feature-text">
                Flujo claro y directo para que el usuario encuentre opciones rápido.
              </p>
            </article>

            <article className="orc-feature-card">
              <h3 className="orc-feature-title">Resultados claros</h3>
              <p className="orc-feature-text">
                Visualización ordenada de vehículos, precios y selección.
              </p>
            </article>

            <article className="orc-feature-card">
              <h3 className="orc-feature-title">Resumen inmediato</h3>
              <p className="orc-feature-text">
                El usuario puede revisar el precio final y su elección al instante.
              </p>
            </article>
          </section>
        </div>
      </main>
    </>
  );
}