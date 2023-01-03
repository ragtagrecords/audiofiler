import React from 'react';
import { Song } from 'Types';
import { downloadFile, removeExtraExtensions } from 'Services';
import './styles.scss';
import { IconButton, IconButtonTypes } from 'Components/Common/IconButton/IconButton';

type DownloadableFile = {
  folder: string;
  actualFileName: string;
  desiredFileName: string;
}

type FileListProps = {
  songs: Song[];
}

export const FileList = ({ songs }: FileListProps) => {
  if (!songs || !songs[0].path) {
    return (
      <div>No files found :(</div>
    );
  }

  const files: DownloadableFile[] = [];

  songs.forEach((song) => {
    if (song && song.path) {
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
      <ul className="download-options">
        {files.map((file: DownloadableFile) => {
          let iconType : IconButtonTypes;
          switch (file.folder) {
            case 'songs':
              iconType = 'audio-file';
              break;
            case 'zips':
              iconType = 'zip-file';
              break;
            case 'images':
              iconType = 'image-file';
              break;
            default:
              iconType = 'file';
          }

          return (
            <li
              key={file.actualFileName}
              onClick={() => {
                downloadFile(file.folder, file.actualFileName, file.desiredFileName);
              }}
            >
              <IconButton
                type={iconType}
                size="20px"
                onClick={() => { return null; }}
              />
              <p>
                {file.desiredFileName}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
};
