'use client';

import {
  MessageOutlined,
  FileTextOutlined,
  DollarOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Row, Col } from 'antd';
import React from 'react';

import Transactions from '../Transactions';

import CustomerSchedule from './CustomerSchedule';
import DailySalesChart from './DailySalesChart';
import DashboardCard from './DashboardCard';
import TopBookingsByServiceCategory from './TopBookingsByServiceCategory';

const cards = [
  { id: 1, icon: <MessageOutlined />, value: 289, title: 'Patient' },
  { id: 2, icon: <FileTextOutlined />, value: 112, title: 'Report' },
  { id: 3, icon: <DollarOutlined />, value: '$1700', title: 'Income' },
  { id: 4, icon: <StarOutlined />, value: 5, title: 'Review' },
];

export default function DashboardStats() {
  return (
    <div>
      <Row gutter={24} style={{ marginBottom: '20px' }}>
        {/* Main content column: Chart + Cards side by side */}
        <Col xs={24} md={16}>
          <Row gutter={16}>
            <Col xs={24} md={19}>
              <DailySalesChart />
            </Col>
            <Col xs={24} md={5}>
              <div className="flex flex-col gap-4">
                {cards.map((card) => (
                  <DashboardCard
                    key={card.id}
                    icon={card.icon}
                    value={card.value}
                    title={card.title}
                  />
                ))}
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={8}>
          <CustomerSchedule />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} md={16}>
          <div className="bg-white p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
            <Transactions fromDashboard />
          </div>
        </Col>
        <Col xs={24} md={8}>
          <TopBookingsByServiceCategory />
        </Col>
      </Row>
    </div>
  );
}
