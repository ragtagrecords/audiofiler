import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from 'Services';
import { MenuOption } from 'Types';

type UserOptionsProps = {
    options: MenuOption[];
    setIsMenuOpen: any;
  }

// When logged in
export const UserOptions = ({ options, setIsMenuOpen }: UserOptionsProps) => {
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await logout();
    navigate('/login');
  };

  return (
    <ul>
      {/* Options from props */}
      {options && options.map((option: MenuOption) => {
        return (
          <li key={`menu-option-${option.text}`}>
            {option.onClick
              ? (
                <a
                  onClick={() => {
                    setIsMenuOpen(false);
                    option.onClick();
                  }}
                >
                  {option.text}
                </a>
              )
              : (
                <a
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate(option.href, {
                      state: option.state,
                    });
                  }}
                >
                  {option.text}
                </a>
              )}

          </li>
        );
      })}
      {/* Logout option */}
      <li key="menu-option-logout">
        <a
          type="button"
          onClick={handleLogout}
        >
          Logout
        </a>
      </li>
    </ul>
  );
};
