import React, { createContext, useContext, useState } from 'react';
import { PlaylistCtx } from 'Pages/Playlist/Playlist';
import { PLAYLIST_SELECTORS } from 'Pages/Playlist/PlaylistSlice';
import { useAppSelector } from 'Hooks/hooks';
import { BodyType, Playlist, Song } from 'Types';
import { updateSong } from 'Services';
import { Draggable } from 'react-beautiful-dnd';
import './Item.scss';
import { IconButton } from 'Components';
import { removeSongFromPlaylist } from 'Services/PlaylistSvc';

interface ItemContextInterface {
  song: Song,
  playlist: Playlist,
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

  const playlistContext = useContext(PlaylistCtx);
  if (!playlistContext || !playlist || !playlist.songs) {
    return null;
  }

  const {
    loadPlaylist,
  } = playlistContext;

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
    loadPlaylist();
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
