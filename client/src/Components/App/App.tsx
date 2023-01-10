import React, {
  useEffect,
  useRef,
} from 'react';
import { AudioPlayer, Header } from 'Components';
import { AudioPlayerLoader } from 'Components/AudioPlayer/audioPlayerLoader';
import { useAppSelector } from 'Hooks/hooks';
import { AppLoader } from './appLoader';
import './App.scss';
import { APP_SELECTORS } from './appSlice';

type AppProps = {
  children: React.ReactNode;
}

export const App = ({ children }: AppProps) => {
  const backgroundColor = useAppSelector(APP_SELECTORS.backgroundColor);
  const pageContentRef: React.RefObject<HTMLDivElement> = useRef(null);

  const appLoader = new AppLoader();
  const audioPlayerLoader = new AudioPlayerLoader();

  const setPageContentHeight = () => {
    const curr = pageContentRef.current;
    if (curr) {
      const pageWidth = curr.clientWidth;
      if (pageWidth < 1080) {
        curr.style.height = `${window.innerHeight - 260}px`; // mobile/tablet footer
      } else {
        curr.style.height = `${window.innerHeight - 200}px`; // desktop footer
      }
    }
  };

  // use JS to set window height - more accurate than VH on mobile
  useEffect(() => {
    appLoader.loadUser();
    audioPlayerLoader.loadAllSongs();
    appLoader.loadPlaylists();
    setPageContentHeight();
    window.onresize = setPageContentHeight;
  }, []);

  return (
    <>
      <div
        className="appContainer"
        style={{ backgroundColor }}
      >
        <Header />
        <div className="pageContent" ref={pageContentRef}>
          {children}
        </div>
        <div className="footer">
          <AudioPlayer />
        </div>
      </div>
    </>
  );
};
