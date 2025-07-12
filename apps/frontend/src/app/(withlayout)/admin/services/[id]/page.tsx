import React from 'react'
import { getDynamicValueById } from '@/utils/getDynamicValueById'
import Service from '@/components/Services/Service'

export async function generateMetadata(context: any) {
  const { params } = context
  const { id } = params

  const data = await getDynamicValueById('accessToken', id, 'services')

  return {
    title: `Services | ${data?.data.name}`,
    description: data?.data.description,
  }
}

export default async function SingleService({ params }: any) {
  const { id } = params
  const data = await getDynamicValueById('accessToken', id, 'services')

  return (
    <>
      <Service service={data?.data} />
    </>
  )
}
