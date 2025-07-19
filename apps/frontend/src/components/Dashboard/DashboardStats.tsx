"use client"

import React from 'react'
import { Row, Col, Card } from 'antd'
import { MessageOutlined, LineChartOutlined, StarOutlined, SafetyOutlined } from '@ant-design/icons'
import DashboardCard from './DashboardCard'
import DumbbellChart from './DumbellChart'
// import { Column } from '@ant-design/charts' // Uncomment if using charts

const cards = [
  { id: 1, icon: <MessageOutlined />, value: 5082, title: 'Consultation' },
  { id: 2, icon: <LineChartOutlined />, value: 2082, title: 'In Progress' },
  { id: 3, icon: <StarOutlined />, value: 1082, title: 'In Review' },
  { id: 4, icon: <SafetyOutlined />, value: 1000, title: 'Report Done' },
]

// Chart config here if using a chart library

export default function DashboardStats() {
  return (
    <Row gutter={16} className="mt-8">
      {cards.map(card => (
        <Col key={card.id} xs={24} sm={12} md={4}>
          <DashboardCard {...card} />
        </Col>
      ))}
      <Col xs={24} sm={24} md={8}>
        <Card
          className="min-h-[180px] flex flex-col justify-between w-full"
          style={{ height: '100%', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div className="font-semibold flex justify-between">
            <span>Patient Visit</span>
            <span className="text-xs text-gray-400">Daily ▼</span>
          </div>
          {/* Replace with <Column {...config} /> if using @ant-design/charts */}
          <div className="flex-1 flex items-center justify-center text-gray-400 w-full">
          <DumbbellChart />
          </div>
        </Card>
      </Col>
    </Row>
  )
}