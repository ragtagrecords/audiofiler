import React from 'react';
import { Link } from 'react-router-dom';

type LoginOptionsProps = {
    setIsMenuOpen: any;
}

export const LoginOptions = ({ setIsMenuOpen }: LoginOptionsProps) => {
  return (
    <ul>
      <li>
        <Link
          onClick={() => {
            setIsMenuOpen(false);
          }}
          to="/login"
        >
          Login
        </Link>
      </li>
      <li>
        <Link
          onClick={() => {
            setIsMenuOpen(false);
          }}
          to="/signup"
        >
          Sign Up
        </Link>
      </li>
    </ul>
  );
};
