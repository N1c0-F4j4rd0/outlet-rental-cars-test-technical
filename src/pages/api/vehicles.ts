import type { NextApiRequest, NextApiResponse } from 'next';

const vehicles = [
  {
    id: '1',
    name: 'Toyota Corolla',
    pricePerDay: 45,
    category: 'Sedán',
    passengers: 5,
    transmission: 'Automático',
    fuel: 'Eficiente',
    description:
      'Sedán económico y confiable, ideal para recorridos urbanos, viajes de negocios y traslados con excelente rendimiento de combustible.',
  },
  {
    id: '2',
    name: 'Chevrolet Tahoe',
    pricePerDay: 78,
    category: 'SUV',
    passengers: 7,
    transmission: 'Automático',
    fuel: 'Gasolina',
    description:
      'SUV amplia y cómoda, recomendada para familias, grupos pequeños y viajes largos con mayor espacio para pasajeros y equipaje.',
  },
  {
    id: '3',
    name: 'Ford Mustang Convertible',
    pricePerDay: 95,
    category: 'Convertible',
    passengers: 4,
    transmission: 'Automático',
    fuel: 'Gasolina',
    description:
      'Convertible deportivo con diseño elegante, ideal para escapadas, rutas panorámicas y una experiencia de conducción más exclusiva.',
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(vehicles);
}