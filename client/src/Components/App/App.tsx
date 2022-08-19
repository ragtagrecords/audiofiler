import React, {
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Song } from 'Types';
import * as _ from 'Components';
import './App.scss';

type AppContextType = {
  song: Song | null;
  songs: Song[] | null;
  playlistID: number | null;
  arePortalsOpen: boolean;
  setSong: any;
  setSongs: any;
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
  const [song, setSong] = useState<Song | null>(null);
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [playlistID, setPlaylistID] = useState<number | null>(null);
  const [arePortalsOpen, setArePortalsOpen] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<string>('#1e5c93');

  const pageContentRef: React.RefObject<HTMLDivElement> = useRef(null);

  /// Given a songID, finds the index in songs array
  const findIndexBySongID = (id: number) => {
    if (!songs) {
      console.log('ERROR: no songs in playlist');
      return -1;
    }

    let index = 0;
    for (let i = 0; i < songs.length; i += 1) {
      if (songs[i].id === id) {
        index = i;
        return index;
      }
    }
    return -1;
  };

  // Ensures index is valid for the current # of songs
  const validIndex = (i: number) => {
    if (!songs) { console.log('ERROR: no songs in playlist'); return 0; }
    const maxIndex = songs.length;
    const remainder = Math.abs(i % maxIndex);
    // If index was negative, return the difference
    return i >= 0 ? remainder : songs.length - remainder;
  };

  // Used for skipping and going to previous songs
  const changeSongRelativeToCurrent = (relativeIndexOfNewSong: number) => {
    if (!song || !song.id) {
      return false;
    }
    const currentSongIndex = findIndexBySongID(song.id);

    if (currentSongIndex === -1) {
      console.log('Could not determine index of currently selected song');
      return false;
    }
    if (!songs) { console.log('ERROR: no songs in playlist'); return 0; }
    const newSongIndex = validIndex(currentSongIndex + relativeIndexOfNewSong);
    const newSong = songs[newSongIndex];

    if (!newSong.id) {
      console.log('Could not find valid ID for new song');
      return false;
    }

    setSong(newSong);
    return true;
  };

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
      song,
      setSong,
      songs,
      setSongs,
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
        <_.Header />
        <div className="pageContent" ref={pageContentRef}>
          {children}
        </div>
        <div className="footer">
          <_.AudioPlayer
            song={song ?? null}
            skipSong={() => {
              changeSongRelativeToCurrent(1);
            }}
            prevSong={() => {
              changeSongRelativeToCurrent(-1);
            }}
          />
        </div>
      </div>
    </AppCtx.Provider>
  );
};
