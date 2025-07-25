import { CaretRightOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Collapse, theme } from 'antd';
import type { CSSProperties } from 'react';
import React from 'react';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (
  panelStyle
) => [
  {
    key: '1',
    label: (
      <p className="text-base font-normal">
        How do i become a member of the portal?
      </p>
    ),
    children: <p>{text}</p>,
    style: panelStyle,
  },
  {
    key: '2',
    label: (
      <p className="text-base font-normal">
        What is the payment system of the portal?
      </p>
    ),
    children: <p>{text}</p>,
    style: panelStyle,
  },
  {
    key: '3',
    label: (
      <p className="text-base font-normal">
        How long do you guys offering services?
      </p>
    ),
    children: <p>{text}</p>,
    style: panelStyle,
  },
];

const SVCollapse: React.FC = () => {
  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1']}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      expandIconPosition="end"
      style={{ background: token.colorBgContainer }}
      items={getItems(panelStyle)}
    />
  );
};

export default SVCollapse;
