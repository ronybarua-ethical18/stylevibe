import React from 'react';

import Service from '@/components/Services/Service';
import { getDynamicValueById } from '@/utils/getDynamicValueById';

export async function generateMetadata(context: any) {
  const { params } = context;
  const { id } = params;

  const data = await getDynamicValueById('accessToken', id, 'services');

  return {
    title: `Services | ${data?.data.name}`,
    description: data?.data.description,
  };
}

export default async function SingleService({ params }: any) {
  const { id } = params;
  const data = await getDynamicValueById('accessToken', id, 'services');

  return (
    <>
      <Service service={data?.data} />
    </>
  );
}
