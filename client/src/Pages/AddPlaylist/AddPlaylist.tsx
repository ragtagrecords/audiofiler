import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderPortal, UserMenu } from 'Components';
import { databaseServerURL } from 'env';
import axios from 'axios';
import Logo from 'Assets/audio-logo-192.webp';

export const AddPlaylist = () => {
  const [playlistName, setPlaylistName] = useState<string>('');
  const [isAddingSongs, setIsAddingSongs] = useState<boolean>(false);
  const navigate = useNavigate();

  // Whenever inputs change the events are directed here
  // Updates the appropriate state variable with new value from input
  const handleChange = (e: any) => {
    if (!e || !e.target || !e.target.value || !e.target.className) {
      console.log('Failed to submit new playlist');
    } else if (e.target.className === 'playlistNameInput') {
      setPlaylistName(e.target.value);
    } else if (e.target.className === 'addSongsCheckbox') {
      setIsAddingSongs(e.target.checked);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Assemble formData for POST
    const formData = new FormData();
    formData.append('name', playlistName);

    try {
      // POST new playlist to API
      const res = await axios.post(
        `${databaseServerURL()}/playlists`,
        formData,
      );

      // Redirect to add songs page if user checked the box
      if (isAddingSongs) {
        navigate('/songs/add', {
          state: { playlist: res.data },
        });
      } else {
        const newPlaylistID = res.data.id;
        navigate(`/playlists/${newPlaylistID}`);
      }
    } catch (ex) {
      console.log(ex);
    }
  };
  return (
    <>
      <HeaderPortal
        center={<img src={Logo} alt="Audiofiler Logo" width="60px" />}
        right={<UserMenu options={[]} />}
      />
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <label>
            <h4>Playlist Name</h4>
            <input
              onChange={handleChange}
              type="text"
              className="playlistNameInput"
              value={playlistName}
            />
          </label>
          <label className="flexLabel">
            <h4>Add songs?</h4>
            <figure className="checkboxContainer">
              <input
                onChange={handleChange}
                type="checkbox"
                className="addSongsCheckbox"
                checked={isAddingSongs}
              />
              <span className="checkmark" />
            </figure>
          </label>
          <button type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};
