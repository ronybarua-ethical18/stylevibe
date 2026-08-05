import { Col, Row } from 'antd';
import React from 'react';
import SVSectionHeading from '../SVSectionHeading';
import SVCard from './SVCard';
import { dummyServices } from '@/utils/dummyServices';

export default function SVServiceCard({ services, loading }: any) {
  const topServices = loading ? dummyServices : services;
  return (
    <div className="w-3/4 m-auto my-24">
      <SVSectionHeading
        eyebrow="Top rated this week"
        title1="Services people"
        title2="rebook"
        subtitle="Real availability from verified providers — every rating comes from a completed appointment."
      />
      <div className="mt-12" />
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {topServices?.slice(0, 4).map((service: any, index: any) => (
          <Col
            xs={24}
            sm={12}
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
