export interface Vehicle {
  id: string;
  name: string;
  pricePerDay: number;
  category?: string;
  passengers?: number;
  transmission?: string;
  fuel?: string;
  description?: string;
  image?: string;
}