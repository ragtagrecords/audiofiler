import React, { createContext, useState } from 'react';
import { PLAYLIST_SELECTORS } from 'Pages/Playlist/playlistSlice';
import { useAppSelector } from 'Hooks/hooks';
import {
  BodyType, FetchableObject, Playlist, Song,
} from 'Types';
import { updateSong } from 'Services';
import { Draggable } from 'react-beautiful-dnd';
import './Item.scss';
import { PlaylistLoader } from 'Pages/Playlist/playlistLoader';

interface ItemContextInterface {
  song: Song,
  playlist: FetchableObject<{data: Playlist | null}>;
  isEdited: any;
  isOpen: boolean;
  bodyType: BodyType;
  setIsOpen: any;
  setEditedSong: any,
  setBodyType: any,
  saveEditedSongToDB: any,
  discardEdits: any,
}

export const ItemCtx = createContext<ItemContextInterface | null>(null);

type ItemProps = {
  children: React.ReactNode,
  song: Song;
  index: number;
}

export const Item = ({
  children,
  song,
  index,
}: ItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedSong, setEditedSong] = useState<Song>(song);
  const [bodyType, setBodyType] = useState<BodyType>('info');
  const playlist = useAppSelector(PLAYLIST_SELECTORS.playlist);
  const mode = useAppSelector(PLAYLIST_SELECTORS.mode);
  const playlistLoader = new PlaylistLoader();

  if (!playlist.data) {
    return null;
  }

  playlistLoader.setPlaylistID(playlist.data.id.toString());

  const wereEditsMade = () => {
    let wasTempoChanged = null;
    if (typeof editedSong.tempo === 'number') {
      wasTempoChanged = song.tempo !== editedSong.tempo;
    } else if (typeof editedSong.tempo === 'string') {
      wasTempoChanged = song.tempo !== parseInt(editedSong.tempo, 10);
    }
    const wasNotesChanged = song.notes !== editedSong.notes;
    const wasNameChanged = song.name !== editedSong.name;
    return wasTempoChanged || wasNameChanged || wasNotesChanged;
  };

  const discardEdits = () => {
    setEditedSong({ ...song });
  };

  const saveEditedSongToDB = async () => {
    if (!editedSong) {
      return false;
    }

    if (editedSong.name === '') {
      alert('Name cannot be empty!');
      return false;
    }

    const success = await updateSong({ ...editedSong });

    if (!success) { return false; }
    await playlistLoader.loadSongs();
    return true;
  };

  const isEdited = mode.current === 'editing' && wereEditsMade();

  return (
    <Draggable
      key={`${song.id} `}
      draggableId={String(song.id)}
      index={index}
      isDragDisabled={mode.current !== 'dragging'}
    >
      {(provided, snapshot) => (
        <div
          className={`
            item
            ${snapshot.isDragging ? 'dragging' : ''}
          `}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <ItemCtx.Provider
            value={{
              song: mode.current === 'editing' ? editedSong : song,
              playlist,
              isEdited,
              isOpen: mode.current !== 'adding' && isOpen,
              bodyType,
              setEditedSong,
              setBodyType,
              setIsOpen,
              saveEditedSongToDB,
              discardEdits,
            }}
          >
            {children}
          </ItemCtx.Provider>
        </div>
      )}
    </Draggable>
  );
};
