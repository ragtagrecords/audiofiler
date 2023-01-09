import React, { useMemo, useState } from 'react';
import { MenuOption } from 'Types';
import { IconContext } from 'react-icons';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import './UserMenu.scss';
import { LoginOptions, UserOptions } from 'Components';
import { useAppSelector } from 'Hooks/hooks';
import { APP_SELECTORS } from 'Components/App/appSlice';

type UserMenuProps = {
  options: MenuOption[];
}

export const UserMenu = ({ options }: UserMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '50px',
  }), []);

  const user = useAppSelector(APP_SELECTORS.user);

  return (
    <div className="userMenuContainer">

      {/* Menu Icon */}
      <IconContext.Provider value={iconStyles}>
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          className="userMenuButton"
        >
          <BiDotsVerticalRounded />
        </button>
      </IconContext.Provider>

      {/* Options that show on click */}
      <div className={`optionsContainer ${isMenuOpen ? 'show' : ''}`}>
        {user
          ? (
            <>
              <h2>{user.username}</h2>
              <hr />
              <UserOptions
                options={options}
                setIsMenuOpen={setIsMenuOpen}
              />
            </>
          )
          : <LoginOptions setIsMenuOpen={setIsMenuOpen} />}
      </div>
    </div>
  );
};
