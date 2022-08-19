import { AppCtx } from 'Components/App/App';
import { IconButton } from 'Components/Common/IconButton/IconButton';
import React, { useContext, useEffect } from 'react';
import { Portal } from 'react-portal';
import { useNavigate } from 'react-router-dom';
import Logo from 'Assets/audio-logo-192.webp';

type HeaderPortalProps = {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  showBackButton?: boolean;
}
export const HeaderPortal = ({
  left,
  center,
  right,
  showBackButton,
}: HeaderPortalProps) => {
  // Use context to trigger header to rerender
  const appContext = useContext(AppCtx);
  const navigate = useNavigate();

  useEffect(() => {
    if (appContext && !appContext.arePortalsOpen) {
      appContext.setArePortalsOpen(true);
    }
  }, []);

  return (
    <>
      <Portal node={document && document.getElementById('header-left')}>
        {left ?? showBackButton ? (
          <IconButton
            type="back"
            size="40px"
            onClick={() => { navigate('/'); }}
          />
        ) : <div />}
      </Portal>
      <Portal node={document && document.getElementById('header-center')}>
        {center ?? (
          <img src={Logo} alt="Audiofiler Logo" width="60px" />
        )}
      </Portal>
      <Portal node={document && document.getElementById('header-right')}>
        {right ?? <div />}
      </Portal>
    </>
  );
};

HeaderPortal.defaultProps = {
  showBackButton: true,
  left: null,
  center: null,
  right: null,
};
