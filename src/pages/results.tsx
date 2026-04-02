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
        <title>Resultados de búsqueda | Outlet Rental Cars</title>
        <meta
          name="description"
          content="Resultados de búsqueda y selección de vehículos"
        />
      </Head>

      <main
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(180deg, #10195b 0%, #10195b 48%, #f4f6fb 48%, #f4f6fb 100%)',
          padding: '42px 24px 90px',
        }}
      >
        <section
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '24px',
              flexWrap: 'wrap',
              marginBottom: '30px',
            }}
          >
            <div style={{ maxWidth: '760px' }}>
              <p
                style={{
                  margin: 0,
                  color: '#39e58c',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.9rem',
                }}
              >
                Búsqueda de vehículos
              </p>

              <h1
                style={{
                  marginTop: '12px',
                  marginBottom: '12px',
                  fontSize: '3rem',
                  lineHeight: 1.05,
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                Vehículos disponibles para tu viaje
              </h1>

              <p
                style={{
                  margin: 0,
                  color: '#d0d5dd',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                }}
              >
                Revisa las opciones disponibles para{' '}
                <strong>{searchParams.location || 'tu destino'}</strong> desde el{' '}
                <strong>{searchParams.pickupDate}</strong> hasta el{' '}
                <strong>{searchParams.dropoffDate}</strong>.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '18px',
                padding: '18px 20px',
                minWidth: '280px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <p
                style={{
                  marginTop: 0,
                  marginBottom: '10px',
                  color: '#ffffff',
                  fontWeight: 700,
                }}
              >
                Moneda de visualización
              </p>

              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
                aria-label="Seleccionar moneda"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#101828',
                  outline: 'none',
                }}
              >
                <option value="USD">USD - Dólar estadounidense</option>
                <option value="COP">COP - Peso colombiano</option>
                <option value="EUR">EUR - Euro</option>
              </select>

              <p
                style={{
                  marginTop: '10px',
                  marginBottom: 0,
                  color: '#d0d5dd',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                }}
              >
                Conversión mock para la prueba técnica. En producción debería
                venir desde un servicio externo.
              </p>
            </div>
          </div>

          <section
            style={{
              background: '#ffffff',
              borderRadius: '26px',
              padding: '20px 24px',
              boxShadow: '0 22px 55px rgba(16, 24, 40, 0.12)',
              marginBottom: '26px',
            }}
            aria-label="Resumen de la búsqueda"
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <p style={{ margin: 0, color: '#667085', fontSize: '0.85rem' }}>Destino</p>
                <p style={{ marginTop: '6px', marginBottom: 0, color: '#101828', fontWeight: 700 }}>
                  {searchParams.location}
                </p>
              </div>

              <div>
                <p style={{ margin: 0, color: '#667085', fontSize: '0.85rem' }}>Recogida</p>
                <p style={{ marginTop: '6px', marginBottom: 0, color: '#101828', fontWeight: 700 }}>
                  {searchParams.pickupDate}
                </p>
              </div>

              <div>
                <p style={{ margin: 0, color: '#667085', fontSize: '0.85rem' }}>Devolución</p>
                <p style={{ marginTop: '6px', marginBottom: 0, color: '#101828', fontWeight: 700 }}>
                  {searchParams.dropoffDate}
                </p>
              </div>

              <div>
                <p style={{ margin: 0, color: '#667085', fontSize: '0.85rem' }}>Duración</p>
                <p style={{ marginTop: '6px', marginBottom: 0, color: '#101828', fontWeight: 700 }}>
                  {rentalDays} {rentalDays === 1 ? 'día' : 'días'}
                </p>
              </div>
            </div>
          </section>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '26px',
              alignItems: 'start',
            }}
          >
            <section
              aria-labelledby="resultados-title"
              style={{
                background: '#ffffff',
                borderRadius: '28px',
                padding: '26px',
                boxShadow: '0 22px 55px rgba(16, 24, 40, 0.12)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <h2
                    id="resultados-title"
                    style={{
                      marginTop: 0,
                      marginBottom: '8px',
                      fontSize: '1.8rem',
                      color: '#101828',
                    }}
                  >
                    Resultados disponibles
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      color: '#667085',
                    }}
                  >
                    Selecciona el vehículo que mejor se adapte a tu viaje.
                  </p>
                </div>

                <div
                  style={{
                    background: '#f2f4f7',
                    borderRadius: '999px',
                    padding: '10px 14px',
                    color: '#344054',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                  }}
                >
                  {results.length} vehículos encontrados
                </div>
              </div>

              {results.length === 0 ? (
                <p style={{ margin: 0, color: '#475467' }}>
                  No se encontraron vehículos disponibles para esta búsqueda.
                </p>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gap: '20px',
                  }}
                >
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
                        style={{
                          border: isSelected ? '2px solid #6d4aff' : '1px solid #eaecf0',
                          borderRadius: '24px',
                          padding: '24px',
                          background: isSelected
                            ? 'linear-gradient(180deg, #f7f4ff 0%, #f4f0ff 100%)'
                            : '#ffffff',
                          boxShadow: isSelected
                            ? '0 16px 36px rgba(109, 74, 255, 0.12)'
                            : '0 10px 24px rgba(16, 24, 40, 0.06)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1.6fr 1fr auto',
                            gap: '18px',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div
                              style={{
                                display: 'inline-block',
                                background: '#ecfdf3',
                                color: '#027a48',
                                fontWeight: 800,
                                fontSize: '0.78rem',
                                padding: '8px 12px',
                                borderRadius: '999px',
                                marginBottom: '14px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              Vehículo disponible
                            </div>

                            <h3
                              style={{
                                marginTop: 0,
                                marginBottom: '10px',
                                fontSize: '1.45rem',
                                color: '#101828',
                              }}
                            >
                              {vehicle.name}
                            </h3>

                            <p style={{ margin: 0, color: '#475467', lineHeight: 1.7 }}>
                              Ideal para viajes cómodos, reservas rápidas y un flujo
                              de selección simple dentro de la prueba técnica.
                            </p>
                          </div>

                          <div>
                            <p style={{ marginTop: 0, marginBottom: '8px', color: '#667085', fontSize: '0.9rem' }}>
                              Precio por día
                            </p>
                            <p
                              style={{
                                marginTop: 0,
                                marginBottom: '16px',
                                color: '#101828',
                                fontWeight: 800,
                                fontSize: '1.45rem',
                              }}
                            >
                              {formatCurrency(convertedDailyPrice, currency)}
                            </p>

                            <p style={{ marginTop: 0, marginBottom: '8px', color: '#667085', fontSize: '0.9rem' }}>
                              Total estimado
                            </p>
                            <p
                              style={{
                                margin: 0,
                                color: '#101828',
                                fontWeight: 800,
                                fontSize: '1.2rem',
                              }}
                            >
                              {formatCurrency(convertedTotalPrice, currency)}
                            </p>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                              type="button"
                              onClick={() => dispatch(selectVehicle(vehicle))}
                              style={{
                                background: isSelected ? '#39e58c' : '#6d4aff',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '16px',
                                padding: '14px 20px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                minWidth: '160px',
                              }}
                              aria-pressed={isSelected}
                            >
                              {isSelected ? 'Seleccionado' : 'Seleccionar'}
                            </button>

                            <div
                              style={{
                                textAlign: 'center',
                                color: '#667085',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                              }}
                            >
                              {rentalDays} {rentalDays === 1 ? 'día' : 'días'} de renta
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <aside
              aria-labelledby="resumen-title"
              style={{
                background: '#ffffff',
                borderRadius: '28px',
                padding: '26px',
                boxShadow: '0 22px 55px rgba(16, 24, 40, 0.12)',
                position: 'sticky',
                top: '24px',
              }}
            >
              <h2
                id="resumen-title"
                style={{
                  marginTop: 0,
                  marginBottom: '18px',
                  color: '#101828',
                  fontSize: '1.7rem',
                }}
              >
                Resumen de reserva
              </h2>

              {!selectedVehicle ? (
                <p
                  style={{
                    margin: 0,
                    color: '#667085',
                    lineHeight: 1.7,
                  }}
                >
                  Selecciona un vehículo para visualizar el precio final en la
                  moneda que prefieras.
                </p>
              ) : (
                <div>
                  <div
                    style={{
                      background: '#f7f4ff',
                      border: '1px solid #e9d7fe',
                      borderRadius: '18px',
                      padding: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <p style={{ marginTop: 0, marginBottom: '6px', color: '#6941c6', fontWeight: 700 }}>
                      Vehículo seleccionado
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: '#101828',
                        fontWeight: 800,
                        fontSize: '1.15rem',
                      }}
                    >
                      {selectedVehicle.name}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gap: '14px' }}>
                    <div>
                      <p style={{ margin: 0, color: '#667085', fontSize: '0.88rem' }}>Destino</p>
                      <p style={{ marginTop: '6px', marginBottom: 0, color: '#101828', fontWeight: 700 }}>
                        {searchParams.location}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: 0, color: '#667085', fontSize: '0.88rem' }}>Recogida</p>
                      <p style={{ marginTop: '6px', marginBottom: 0, color: '#101828', fontWeight: 700 }}>
                        {searchParams.pickupDate}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: 0, color: '#667085', fontSize: '0.88rem' }}>Devolución</p>
                      <p style={{ marginTop: '6px', marginBottom: 0, color: '#101828', fontWeight: 700 }}>
                        {searchParams.dropoffDate}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: 0, color: '#667085', fontSize: '0.88rem' }}>Duración</p>
                      <p style={{ marginTop: '6px', marginBottom: 0, color: '#101828', fontWeight: 700 }}>
                        {rentalDays} {rentalDays === 1 ? 'día' : 'días'}
                      </p>
                    </div>

                    <div>
                      <p style={{ margin: 0, color: '#667085', fontSize: '0.88rem' }}>Moneda</p>
                      <p style={{ marginTop: '6px', marginBottom: 0, color: '#101828', fontWeight: 700 }}>
                        {currency}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '24px',
                      paddingTop: '22px',
                      borderTop: '1px solid #eaecf0',
                    }}
                  >
                    <p
                      style={{
                        marginTop: 0,
                        marginBottom: '8px',
                        color: '#667085',
                        fontSize: '0.95rem',
                      }}
                    >
                      Precio final
                    </p>
                    <p
                      style={{
                        marginTop: 0,
                        marginBottom: '8px',
                        color: '#101828',
                        fontSize: '2rem',
                        fontWeight: 800,
                      }}
                    >
                      {formatCurrency(convertedFinalPrice, currency)}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: '#667085',
                        fontSize: '0.88rem',
                        lineHeight: 1.5,
                      }}
                    >
                      Valor calculado a partir del precio por día multiplicado por la
                      cantidad de días seleccionados.
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gap: '12px',
                      marginTop: '22px',
                    }}
                  >
                    <div
                      style={{
                        background: '#ecfdf3',
                        color: '#027a48',
                        borderRadius: '14px',
                        padding: '12px 14px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      Cancelación flexible disponible
                    </div>

                    <div
                      style={{
                        background: '#eff8ff',
                        color: '#175cd3',
                        borderRadius: '14px',
                        padding: '12px 14px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      Proceso de selección rápido y claro
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
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