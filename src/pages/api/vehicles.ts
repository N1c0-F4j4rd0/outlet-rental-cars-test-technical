import type { NextApiRequest, NextApiResponse } from 'next';

const vehicles = [
  { id: '1', name: 'Toyota Corolla', pricePerDay: 45 },
  { id: '2', name: 'Chevrolet Tahoe', pricePerDay: 78 },
  { id: '3', name: 'Ford Mustang Convertible', pricePerDay: 95 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(vehicles);
}