export const formatDate = (date: string | null): string => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}; 