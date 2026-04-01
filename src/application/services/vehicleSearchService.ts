import { Vehicle } from '@/domain/entities/vehicle';

export const fetchVehicles = async (baseUrl: string): Promise<Vehicle[]> => {
  const response = await fetch(`${baseUrl}/api/vehicles`);

  if (!response.ok) {
    throw new Error('Failed to fetch vehicles');
  }

  return response.json();
};