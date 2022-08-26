import React, {
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Song } from 'Types';
import { AudioPlayer, Header } from 'Components';
import './App.scss';
import { AUDIO_PLAYER_SELECTORS } from 'Components/AudioPlayer/audioPlayerSlice';
import { useAppSelector } from 'Hooks/hooks';

type AppContextType = {
  playlistID: number | null;
  arePortalsOpen: boolean;
  setPlaylistID: any;
  setArePortalsOpen: any;
  backgroundColor: string;
  setBackgroundColor: any;
}

export const AppCtx = createContext<AppContextType | null>(null);

type AppProps = {
  children: React.ReactNode;
}

export const App = ({ children }: AppProps) => {
  // State is empty until song is selected
  const [playlistID, setPlaylistID] = useState<number | null>(null);
  const [arePortalsOpen, setArePortalsOpen] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<string>('#1e5c93');

  const pageContentRef: React.RefObject<HTMLDivElement> = useRef(null);

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
    setPageContentHeight();
    window.onresize = setPageContentHeight;
  }, []);

  return (
    <AppCtx.Provider value={{
      playlistID,
      setPlaylistID,
      arePortalsOpen,
      setArePortalsOpen,
      backgroundColor,
      setBackgroundColor,
    }}
    >
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
    </AppCtx.Provider>
  );
};
