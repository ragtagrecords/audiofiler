import React, {
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AudioPlayer, Header } from 'Components';
import './App.scss';

type AppContextType = {
  arePortalsOpen: boolean;
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
  const [arePortalsOpen, setArePortalsOpen] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<string>('#1c1c1c');

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
