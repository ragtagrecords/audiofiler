import React from 'react';
import { Song } from 'Types';
import { downloadFile, removeExtraExtensions } from 'Services';
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
  if (song && song.path) {
    const files: DownloadableFile[] = [];
    const songFileExt = `${song.path.split('.').pop()}` ?? 'mp3';
    files.push({
      folder: 'songs',
      actualFileName: song.path,
      desiredFileName: `${removeExtraExtensions(song.name)}.${songFileExt}`,
    });
    if (song.zipPath) {
      files.push({
        folder: 'zips',
        actualFileName: song.zipPath,
        desiredFileName: `${removeExtraExtensions(song.name)}.zip`,
      });
    }
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
  }
  return (
    <div>No files found :(</div>
  );
};
