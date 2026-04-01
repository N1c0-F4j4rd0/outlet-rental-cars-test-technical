export const calculateFinalPrice = (
  pricePerDay: number,
  pickupDate: string,
  dropoffDate: string
): number => {
  const start = new Date(pickupDate);
  const end = new Date(dropoffDate);

  const diffInMs = end.getTime() - start.getTime();
  const diffInDays = Math.max(Math.ceil(diffInMs / (1000 * 60 * 60 * 24)), 1);

  return pricePerDay * diffInDays;
};