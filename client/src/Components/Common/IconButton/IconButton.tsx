import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineCheck, AiOutlineClose, AiOutlineMinusCircle } from 'react-icons/ai';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { FaPlus, FaPlay } from 'react-icons/fa';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { ImArrowLeft } from 'react-icons/im';
import { IoMdArrowDropdown } from 'react-icons/io';
import {
  BsFileEarmarkFill,
  BsFileEarmarkMusicFill,
  BsFillFileEarmarkImageFill,
  BsFillFileEarmarkZipFill,
} from 'react-icons/bs';
import { HiPhotograph } from 'react-icons/hi';
import styles from './styles.module.scss';

export type IconButtonTypes =
  'save'
  | 'cancel'
  | 'play'
  | 'download'
  | 'upload'
  | 'add'
  | 'remove'
  | 'options'
  | 'back'
  | 'drag'
  | 'dropdown'
  | 'audio-file'
  | 'zip-file'
  | 'image-file'
  | 'file';

type IconButtonProps = {
  type: IconButtonTypes;
  size?: string;
  color?: string;
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const IconButton = ({
  type,
  size,
  color,
  className,
  onClick,
}: IconButtonProps) => {
  const iconStyles = useMemo(() => ({ color, size }), []);

  let icon = null;

  switch (type) {
    case 'save':
      icon = <AiOutlineCheck />;
      break;
    case 'cancel':
      icon = <AiOutlineClose />;
      break;
    case 'play':
      icon = <FaPlay />;
      break;
    case 'download':
      icon = <FiDownload />;
      break;
    case 'upload':
      icon = <FiUpload />;
      break;
    case 'add':
      icon = <FaPlus />;
      break;
    case 'remove':
      icon = <AiOutlineMinusCircle />;
      // TODO: restore
      return null;
      break;
    case 'options':
      icon = <BiDotsVerticalRounded />;
      break;
    case 'back':
      icon = <ImArrowLeft />;
      break;
    case 'dropdown':
      icon = <IoMdArrowDropdown />;
      break;
    case 'file':
      icon = <BsFileEarmarkFill />;
      break;
    case 'audio-file':
      icon = <BsFileEarmarkMusicFill />;
      break;
    case 'zip-file':
      icon = <BsFillFileEarmarkZipFill />;
      break;
    case 'image-file':
      icon = <BsFillFileEarmarkImageFill />;
      break;
    default:
      return null;
  }

  return (
    <button
      type="button"
      className={`${styles.iconButton} ${className}`}
      onClick={onClick}
    >
      <IconContext.Provider value={iconStyles}>
        {icon}
      </IconContext.Provider>
    </button>
  );
};

IconButton.defaultProps = {
  size: '26px',
  color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
  className: '',
};
