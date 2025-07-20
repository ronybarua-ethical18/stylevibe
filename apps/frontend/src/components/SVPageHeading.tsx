import React from 'react';
import SVModal from './ui/SVModal';

interface IPageHeading {
  pageTitle: string;
  numberOfItems: string;
  pageSubTitle: string;
  modalTitle?: string;
  buttonTitle?: string;
  width?: string | number;
}

export default function SVPageHeading({
  pageTitle,
  numberOfItems,
  pageSubTitle,
  modalTitle,
  buttonTitle,
  width,
}: IPageHeading): React.ReactNode {
  return (
    <div className="flexCenterBetween" style={{ margin: '20px 0px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '20px' }}>{pageTitle}</h1>
          <div
            style={{
              background: '#fff',
              padding: '5px 8px',
              borderRadius: '25px',
              marginLeft: '10px',
            }}
          >
            {' '}
            {numberOfItems}
          </div>
        </div>
        <h4 className="font-light">{pageSubTitle}</h4>
      </div>
      {modalTitle && buttonTitle && (
        <SVModal buttonTitle={buttonTitle} width={width} />
      )}
    </div>
  );
}
