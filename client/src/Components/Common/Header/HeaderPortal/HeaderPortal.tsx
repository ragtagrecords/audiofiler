import { IconButton } from 'Components/Common/IconButton/IconButton';
import React, { useEffect } from 'react';
import { Portal } from 'react-portal';
import { useNavigate } from 'react-router-dom';
import Logo from 'Assets/audio-logo-192.webp';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { APP_ACTIONS, APP_SELECTORS } from 'Components/App/appSlice';

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
  const arePortalsOpen = useAppSelector(APP_SELECTORS.arePortalsOpen);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!arePortalsOpen) {
      dispatch(APP_ACTIONS.setArePortalsOpen(true));
    }
  }, []);

  if (!left) {
    if (showBackButton) {
      left = (
        <IconButton
          type="back"
          size="40px"
          onClick={() => { navigate('/'); }}
        />
      );
    } else {
      left = <div />;
    }
  }

  if (!center) {
    center = <img src={Logo} alt="Audiofiler Logo" width="60px" />;
  }

  if (!right) {
    right = <div />;
  }

  return (
    <>
      <Portal node={document && document.getElementById('header-left')}>
        {left}
      </Portal>
      <Portal node={document && document.getElementById('header-center')}>
        {center}
      </Portal>
      <Portal node={document && document.getElementById('header-right')}>
        {right}
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
