'use client';

import React from 'react';
import { Tabs } from 'antd';
import SVShopInfo from './SVShopInfo';
import SVPersonalInfo from './SVPersonalInfo';

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
