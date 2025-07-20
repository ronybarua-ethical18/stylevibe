import { getBaseUrl } from '@/config/envConfig';
import { cookies } from 'next/headers';

export const getDynamicValueById = async (
  key: string,
  id: string | number,
  apiName: string
): Promise<any> => {
  const cookieStore = cookies();
  const token = cookieStore.get(key);

  if (!token) {
    console.error('Token not found in cookies');
    return null;
  }

  // Pass the token in the headers
  const response = await fetch(`${getBaseUrl()}/${apiName}/${id}`, {
    method: 'GET',
    headers: {
      Authorization: token.value,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 10 },
  });

  if (!response.ok) {
    console.error('Error fetching data:', response.statusText);
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    return null;
  }
};
