import React from 'react';
import { Song } from 'Types';
import { getExtension } from 'Services';

type SongFieldsetProps = {
  song: Song;
  updateSong: any;
  parentSongID: number;
}

export const UploadOptionFields = ({ song, updateSong, parentSongID }: SongFieldsetProps) => {
  if (!song.file || parentSongID === -1) {
    return null;
  }

  return (
    <li>
      <input
        type="text"
        className="uploadedFileName"
        value={song.name}
        onChange={(e) => {
          const updatedSong = { ...song };
          updatedSong.name = e.target.value;
          updateSong(updatedSong);
        }}
      />
      <p className="uploadedFileType">
        ({getExtension(song.file.name)} detected)
      </p>
      <div className="uploadVersionOptions">
        {}
        <button
          type="button"
          name="isParent"
          className={`uploadVersionButton ${song.isParent ? 'selected' : ''}`}
          onClick={() => {
            const updatedSong = { ...song };
            updatedSong.isParent = true;
            updateSong(updatedSong);
          }}
        >
          Replace main version
        </button>
        <button
          type="button"
          name="isNewVersion"
          className={`uploadVersionButton ${!song.isParent ? 'selected' : ''}`}
          onClick={() => {
            const updatedSong = { ...song };
            updatedSong.isParent = false;
            updateSong(updatedSong);
          }}
        >
          Add new version
        </button>
      </div>
    </li>
  );
};
