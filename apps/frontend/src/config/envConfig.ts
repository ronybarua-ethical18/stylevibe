export const getBaseUrl = (): string => {
  return (
    process.env.NEXT_APP_API_BASE_URL ||
    'https://stylevibe-backend.onrender.com/api/v1'
  );
};
