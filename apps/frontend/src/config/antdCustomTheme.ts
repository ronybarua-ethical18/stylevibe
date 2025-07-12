// antdCustomTheme.ts

import { ThemeConfig } from 'antd'

const customTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 4,
    // Add more global token overrides here
  },
  components: {
    Button: {
      colorPrimary: '#1890ff',
      algorithm: true, // Enable algorithm
    },
    Checkbox: {
      colorPrimary: '#4d3ca3',
      colorPrimaryHover: '#4d3ca3',
    },
    Radio: {
      colorPrimary: '#4d3ca3',
      colorPrimaryHover: '#4d3ca3',
    },
    Select: {
      colorBgContainer: '#f5f5f5',
      // Add more Select customizations
    },
    Table: {
      headerBg: '#fafafa',
      // Add more Table customizations
    },
    Modal: {
      borderRadiusLG: 20,
      boxShadow: 'none',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      // This sets the border radius for large modals to 20px
      // You can also set borderRadius for all sizes if needed:
      // borderRadius: 20,
      // borderRadiusSM: 20,
    },
    // Add more component-specific customizations
  },
}

// You can also define custom styles that are not part of Ant Design's theme system
const customStyles = {
  filledInput: {
    backgroundColor: '#f5f5f5',
    '&:hover, &:focus': {
      backgroundColor: '#fafafa',
    },
  },
  // Add more custom styles here
}

export { customTheme, customStyles }
