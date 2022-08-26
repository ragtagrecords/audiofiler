import { useAppSelector } from 'Hooks/hooks';
import { PLAYLIST_SELECTORS } from 'Pages/Playlist/PlaylistSlice';
import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineDrag } from 'react-icons/ai';
import { Portal } from 'react-portal';
import styles from './styles.module.scss';

export const DragIconPortal = () => {
  const iconStyles = useMemo(() => ({
    color: '#5ae7ff',
    size: '300px',
  }), []);

  const mode = useAppSelector(PLAYLIST_SELECTORS.mode);

  return (
    <Portal node={document && document.getElementById('root')}>
      <div className={`
        ${styles.container}
        ${mode.current === 'dragging' ? styles.show : ''}`}
      >
        <h1 className={styles.text}>
          Click and drag
        </h1>
        <IconContext.Provider value={iconStyles}>
          <AiOutlineDrag />
        </IconContext.Provider>
      </div>
    </Portal>
  );
};
