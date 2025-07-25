import { Col, Row } from 'antd';
import React from 'react';

import SVSectionTitle from '../SVSectionTitle';

import SVCard from './SVCard';

import { dummyServices } from '@/utils/dummyServices';

export default function SVServiceCard({ services, loading }: any) {
  console.log('top services', services);

  const topServices = loading ? dummyServices : services;
  return (
    <div className="w-3/4 m-auto">
      <SVSectionTitle title1="TOP RATED" title2="SERVICES" />
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {topServices?.map((service: any, index: any) => (
          <Col
            xs={24}
            sm={12}
            md={6}
            lg={6}
            xl={6}
            key={service._id || index}
            className="mb-8"
          >
            <SVCard service={service} loading={loading} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
