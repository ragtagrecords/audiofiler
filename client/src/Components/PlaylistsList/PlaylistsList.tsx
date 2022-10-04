import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlaylists } from 'Services';
import { Playlist } from 'Types';
import listStyles from 'Styles/lists.module.scss';
import styles from './styles.module.scss';

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
    <div className={`${listStyles.listContainer} ${styles.playlists}`}>
      <ul className={`${listStyles.list}`}>
        {playlists && playlists[0].name
            && playlists.map((playlist: Playlist) => {
              return (
                <li key={`playlists-${playlist.id}`} className={`${listStyles.item}`}>
                  <Link to={`/playlists/${playlist.id}`} className={`${listStyles.link}`}>
                    <span className={`${listStyles.nameContainer}`}>
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
