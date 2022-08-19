import React from 'react';
import { MenuOption } from 'Types';
import { HeaderPortal, PlaylistsList, UserMenu } from 'Components';
import Logo from 'Assets/audio-logo-192.webp';

export const Playlists = () => {
  const menuOptions: MenuOption[] = [
    {
      href: '/playlists/add',
      text: 'Add playlist',
    },
  ];

  return (
    <>
      <HeaderPortal
        showBackButton={false}
        left={null}
        right={<UserMenu options={menuOptions} />}
        center={<img src={Logo} alt="Audiofiler Logo" width="60px" />}
      />
      <PlaylistsList />
    </>
  );
};
