import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { vehicleSearchService } from '@/application/services/vehicleSearchService';
import { Vehicle } from '@/domain/entities/vehicle';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectVehicle, setResults } from '@/store/slices/vehiclesSlice';

interface ResultsPageProps {
  vehicles: Vehicle[];
  searchParams: {
    location: string;
    pickupDate: string;
    dropoffDate: string;
  };
}

type CurrencyCode = 'USD' | 'COP' | 'EUR';

const currencyRates: Record<CurrencyCode, number> = {
  USD: 1,
  COP: 4000,
  EUR: 0.92,
};

const currencyLocales: Record<CurrencyCode, string> = {
  USD: 'en-US',
  COP: 'es-CO',
  EUR: 'es-ES',
};

const formatCurrency = (value: number, currency: CurrencyCode): string => {
  return new Intl.NumberFormat(currencyLocales[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'COP' ? 0 : 2,
  }).format(value);
};

const calculateRentalDays = (pickupDate: string, dropoffDate: string): number => {
  const start = new Date(pickupDate);
  const end = new Date(dropoffDate);
  const diffInMs = end.getTime() - start.getTime();
  return Math.max(Math.ceil(diffInMs / (1000 * 60 * 60 * 24)), 1);
};

const calculateFinalPrice = (
  pricePerDay: number,
  pickupDate: string,
  dropoffDate: string
): number => {
  return pricePerDay * calculateRentalDays(pickupDate, dropoffDate);
};

const convertPrice = (amountInUsd: number, currency: CurrencyCode): number => {
  return amountInUsd * currencyRates[currency];
};

export default function ResultsPage({
  vehicles,
  searchParams,
}: ResultsPageProps) {
  const dispatch = useAppDispatch();
  const { results, selectedVehicle } = useAppSelector((state) => state.vehicles);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  useEffect(() => {
    dispatch(setResults(vehicles));
  }, [dispatch, vehicles]);

  const rentalDays = useMemo(() => {
    return calculateRentalDays(searchParams.pickupDate, searchParams.dropoffDate);
  }, [searchParams.pickupDate, searchParams.dropoffDate]);

  const finalPriceInUsd = selectedVehicle
    ? calculateFinalPrice(
        selectedVehicle.pricePerDay,
        searchParams.pickupDate,
        searchParams.dropoffDate
      )
    : 0;

  const convertedFinalPrice = convertPrice(finalPriceInUsd, currency);

  return (
    <>
      <Head>
        <title>Resultados | Outlet Rental Cars</title>
        <meta
          name="description"
          content="Resultados de búsqueda y selección de vehículos"
        />
      </Head>

      <main className="orc-page">
        <div className="orc-container">
          <header className="orc-topbar">
            <div className="orc-logo">
              <div className="orc-logo-title">outlet</div>
              <div className="orc-logo-subtitle">by miles car rental</div>
            </div>

            <div className="orc-chip">Disponibilidad en tiempo real</div>
          </header>

          <section className="orc-results-header">
            <div style={{ maxWidth: '760px' }}>
              <div className="orc-eyebrow">Resultados de tu búsqueda</div>
                <h1 className="orc-title" style={{ marginBottom: '14px', fontSize: '3.4rem' }}>
                  Elige el vehículo ideal para tu próxima aventura
                </h1>
                <p className="orc-description">
                  Estas son las opciones disponibles para <strong>{searchParams.location}</strong>{' '}
                  entre el <strong>{searchParams.pickupDate}</strong> y el{' '}
                  <strong>{searchParams.dropoffDate}</strong>. Compara tarifas y selecciona
                  el auto que mejor se ajuste a tu viaje.
                </p>
            </div>

            <div className="orc-currency-box">
              <p className="orc-currency-title">Moneda de visualización</p>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
                aria-label="Seleccionar moneda"
                className="orc-select"
              >
                <option value="USD">USD - Dólar estadounidense</option>
                <option value="COP">COP - Peso colombiano</option>
                <option value="EUR">EUR - Euro</option>
              </select>
              <p className="orc-currency-note">
                Visualiza el valor estimado de tu reserva en la moneda que prefieras para facilitar la comparación de tarifas.
              </p>
            </div>
          </section>

          <section className="orc-summary-bar" aria-label="Resumen de búsqueda">
            <div>
              <div className="orc-summary-item-label">Destino</div>
              <div className="orc-summary-item-value">{searchParams.location}</div>
            </div>
            <div>
              <div className="orc-summary-item-label">Recogida</div>
              <div className="orc-summary-item-value">{searchParams.pickupDate}</div>
            </div>
            <div>
              <div className="orc-summary-item-label">Devolución</div>
              <div className="orc-summary-item-value">{searchParams.dropoffDate}</div>
            </div>
            <div>
              <div className="orc-summary-item-label">Duración</div>
              <div className="orc-summary-item-value">
                {rentalDays} {rentalDays === 1 ? 'día' : 'días'}
              </div>
            </div>
          </section>

          <section className="orc-results-layout">
            <div className="orc-panel">
              <div className="orc-result-top">
                <div>
                  <h2 className="orc-panel-title">Autos disponibles</h2>
                  <p className="orc-panel-subtext">
                    Compara características y tarifas estimadas antes de confirmar tu elección.
                  </p>
                </div>

                <div className="orc-result-counter">
                  {results.length} vehículos encontrados
                </div>
              </div>

              {results.length === 0 ? (
                <p className="orc-panel-subtext">
                  No se encontraron vehículos disponibles para esta búsqueda.
                </p>
              ) : (
                <div className="orc-cards">
                  {results.map((vehicle) => {
                    const isSelected = selectedVehicle?.id === vehicle.id;
                    const totalInUsd = calculateFinalPrice(
                      vehicle.pricePerDay,
                      searchParams.pickupDate,
                      searchParams.dropoffDate
                    );

                    const convertedDailyPrice = convertPrice(vehicle.pricePerDay, currency);
                    const convertedTotalPrice = convertPrice(totalInUsd, currency);

                    return (
                      <article
                        key={vehicle.id}
                        className={`orc-vehicle-card ${isSelected ? 'selected' : ''}`}
                      >
                        <div>
                          <span className="orc-badge">{vehicle.category || 'Vehículo disponible'}</span>
                          <h3 className="orc-vehicle-name">{vehicle.name}</h3>
                          <p className="orc-vehicle-text">
                            {vehicle.description}
                          </p>

                          <div style={{ marginTop: '12px', color: '#475467', fontSize: '0.95rem', lineHeight: 1.7 }}>
                            {vehicle.passengers ? <div>Capacidad: {vehicle.passengers} pasajeros</div> : null}
                            {vehicle.transmission ? <div>Transmisión: {vehicle.transmission}</div> : null}
                            {vehicle.fuel ? <div>Combustible: {vehicle.fuel}</div> : null}
                          </div>
                        </div>

                        <div>
                          <div className="orc-price-label">Precio por día</div>
                          <div className="orc-price-value">
                            {formatCurrency(convertedDailyPrice, currency)}
                          </div>

                          <div className="orc-price-label">Total estimado</div>
                          <div className="orc-price-total">
                            {formatCurrency(convertedTotalPrice, currency)}
                          </div>
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={() => dispatch(selectVehicle(vehicle))}
                            className={`orc-button ${
                              isSelected ? 'orc-button-success' : 'orc-button-primary'
                            }`}
                            aria-pressed={isSelected}
                          >
                            {isSelected ? 'Seleccionado' : 'Seleccionar'}
                          </button>

                          <div className="orc-rental-days">
                            {rentalDays} {rentalDays === 1 ? 'día' : 'días'} de renta
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="orc-panel orc-aside-box" aria-labelledby="summary-title">
              <h2 id="summary-title" className="orc-panel-title">
                Resumen de reserva
              </h2>

              {!selectedVehicle ? (
                <p className="orc-panel-subtext">
                  Selecciona un vehículo para visualizar el precio final en la moneda
                  que prefieras.
                </p>
              ) : (
                <>
                  <div className="orc-selected-card">
                    <div className="orc-selected-label">Vehículo seleccionado</div>
                    <div className="orc-selected-name">{selectedVehicle.name}</div>
                  </div>

                  <div className="orc-detail-list">
                    <div>
                      <div className="orc-summary-item-label">Destino</div>
                      <div className="orc-summary-item-value">{searchParams.location}</div>
                    </div>
                    <div>
                      <div className="orc-summary-item-label">Recogida</div>
                      <div className="orc-summary-item-value">{searchParams.pickupDate}</div>
                    </div>
                    <div>
                      <div className="orc-summary-item-label">Devolución</div>
                      <div className="orc-summary-item-value">{searchParams.dropoffDate}</div>
                    </div>
                    <div>
                      <div className="orc-summary-item-label">Duración</div>
                      <div className="orc-summary-item-value">
                        {rentalDays} {rentalDays === 1 ? 'día' : 'días'}
                      </div>
                    </div>
                    <div>
                      <div className="orc-summary-item-label">Moneda</div>
                      <div className="orc-summary-item-value">{currency}</div>
                    </div>
                  </div>

                  <div className="orc-divider" />

                  <div className="orc-final-price-label">Precio final</div>
                  <div className="orc-final-price-value">
                    {formatCurrency(convertedFinalPrice, currency)}
                  </div>
                  <p className="orc-note">
                    Valor calculado a partir del precio por día multiplicado por la
                    cantidad de días seleccionados.
                  </p>

                  <div className="orc-benefits">
                    <div className="orc-benefit-success">
                      Tarifas competitivas en ubicaciones seleccionadas
                    </div>
                    <div className="orc-benefit-info">
                      Recogida práctica en ciudad o aeropuerto
                    </div>
                  </div>
                </>
              )}
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { location = '', pickup = '', dropoff = '' } = context.query;

  const locationValue = Array.isArray(location) ? location[0] : location;
  const pickupValue = Array.isArray(pickup) ? pickup[0] : pickup;
  const dropoffValue = Array.isArray(dropoff) ? dropoff[0] : dropoff;

  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const host = context.req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    const vehicles = await vehicleSearchService.search(baseUrl);

    return {
      props: {
        vehicles,
        searchParams: {
          location: locationValue,
          pickupDate: pickupValue,
          dropoffDate: dropoffValue,
        },
      },
    };
  } catch {
    return {
      props: {
        vehicles: [],
        searchParams: {
          location: locationValue,
          pickupDate: pickupValue,
          dropoffDate: dropoffValue,
        },
      },
    };
  }
};