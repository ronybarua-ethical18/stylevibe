'use client';

import { Tabs } from 'antd';
import React from 'react';

import SVPersonalInfo from './SVPersonalInfo';
import SVShopInfo from './SVShopInfo';

const { TabPane } = Tabs;

function SVSettingTabs({ userProfile }: any) {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Personal Info" key="1">
        <SVPersonalInfo userProfile={userProfile} />
      </TabPane>
      <TabPane tab="Shop Info" key="2">
        <SVShopInfo userProfile={userProfile} />
      </TabPane>
    </Tabs>
  );
}

export default SVSettingTabs;
