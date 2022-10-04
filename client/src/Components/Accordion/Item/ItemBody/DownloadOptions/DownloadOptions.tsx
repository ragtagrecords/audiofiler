import React, { useEffect, useState } from 'react';
import { Song } from 'Types';
import { downloadFile, getSongs, removeExtraExtensions } from 'Services';
import './DownloadOptions.scss';

type DownloadableFile = {
  folder: string;
  actualFileName: string;
  desiredFileName: string;
}

type DownloadOptionsProps = {
  song: Song;
}

export const DownloadOptions = ({ song }: DownloadOptionsProps) => {
  const [childrenSongs, setChildrenSongs] = useState<Song[] | null>(null);

  const getSongVersions = async () => {
    const childrenSongs = await getSongs(null, song.id?.toString(10));
    if (childrenSongs) {
      setChildrenSongs([...childrenSongs]);
      return true;
    }
    return false;
  };

  useEffect(() => {
    getSongVersions();
  }, []);

  if (!song || !song.path) {
    return (
      <div>No files found :(</div>
    );
  }

  const files: DownloadableFile[] = [];

  const songs = [song, ...(childrenSongs || [])];

  songs.forEach((song) => {
    if (song && song.path) {
      console.log('path', song.path ? song.path : 'no path');
      console.log(`${song.path.split('.').pop()}`);
      files.push({
        folder: 'songs',
        actualFileName: song.path,
        desiredFileName: `${removeExtraExtensions(song.name)}.mp3`,
      });
      if (song.zipPath) {
        files.push({
          folder: 'zips',
          actualFileName: song.zipPath,
          desiredFileName: `${removeExtraExtensions(song.name)}.zip`,
        });
      }
    }
  });

  return (
    <>
      <ul className="downloadOptions">
        {files.map((file: DownloadableFile) => {
          return (
            <li key={file.actualFileName}>
              <button
                type="button"
                onClick={() => {
                  downloadFile(file.folder, file.actualFileName, file.desiredFileName);
                }}
              >
                {file.desiredFileName}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};
