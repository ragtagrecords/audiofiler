import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlaylists } from 'Services';
import { Playlist } from 'Types';
import './PlaylistsList.scss';

export const PlaylistsList = () => {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);

  const loadPlaylists = async () => {
    setPlaylists(await getPlaylists());
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  if (!playlists) {
    return null;
  }

  return (
    <div className="playlists listContainer">
      <ul>
        {playlists && playlists[0].name
            && playlists.map((playlist: Playlist) => {
              return (
                <li key={`playlists-${playlist.id}`} className="normalListItem">
                  <Link to={`/playlists/${playlist.id}`} className="playlistLink">
                    <span className="nameContainer">
                      {playlist.name}
                    </span>
                  </Link>
                </li>
              );
            })}
      </ul>
    </div>
  );
};
