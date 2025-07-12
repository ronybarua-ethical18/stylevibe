import styled from 'styled-components'
import { Steps } from 'antd'

// Styled Steps component
export const CustomizedSteps = styled(Steps)`
  .ant-steps-item-icon {
    background-color: #4d3ca3 !important;
    border-color: #4d3ca3 !important;
  }

  // Active step
  .ant-steps-item-active .ant-steps-item-icon {
    background-color: #4d3ca3 !important;
    border-color: #4d3ca3 !important;
  }
  .ant-steps-item-active .ant-steps-item-title {
    color: #4d3ca3 !important;
    font-weight: 500; // Make title bold
  }

  // Completed (previous) steps
  .ant-steps-item-finish {
    .ant-steps-item-icon {
      background-color: rgba(
        77,
        60,
        163,
        0.1
      ) !important; // Light opacity background
      border-color: #4d3ca3 !important;
    }
    .ant-steps-icon {
      color: #4d3ca3 !important;
    }
    .ant-steps-item-title {
      color: #4d3ca3 !important;
    }
    .ant-steps-item-title::after {
      background-color: #4d3ca3 !important;
    }
  }

  // Upcoming (next) steps
  .ant-steps-item-wait .ant-steps-item-icon {
    background-color: #ffffff !important;
    border-color: #d9d9d9 !important;
  }
`
