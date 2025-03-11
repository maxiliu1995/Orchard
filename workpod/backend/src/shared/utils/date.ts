export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const addHours = (date: Date, hours: number): Date => {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
};
