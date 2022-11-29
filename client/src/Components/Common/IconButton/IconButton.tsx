import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineCheck, AiOutlineClose, AiOutlineMinusCircle } from 'react-icons/ai';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { FaCrown, FaPlus, FaPlay } from 'react-icons/fa';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { ImArrowLeft } from 'react-icons/im';
import { IoMdArrowDropdown } from 'react-icons/io';
import {
  BsFileEarmarkFill,
  BsFileEarmarkMusicFill,
  BsFillFileEarmarkImageFill,
  BsFillFileEarmarkZipFill,
} from 'react-icons/bs';
import ReactTooltip from 'react-tooltip';
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
  | 'file'
  | 'crown';

const iconSwitch = (type: IconButtonTypes) => {
  switch (type) {
    case 'save':
      return <AiOutlineCheck />;
    case 'cancel':
      return <AiOutlineClose />;
    case 'play':
      return <FaPlay />;
    case 'download':
      return <FiDownload />;
    case 'upload':
      return <FiUpload />;
    case 'add':
      return <FaPlus />;
    case 'remove':
      return <AiOutlineMinusCircle />;
    case 'options':
      return <BiDotsVerticalRounded />;
    case 'back':
      return <ImArrowLeft />;
    case 'dropdown':
      return <IoMdArrowDropdown />;
    case 'file':
      return <BsFileEarmarkFill />;
    case 'audio-file':
      return <BsFileEarmarkMusicFill />;
    case 'zip-file':
      return <BsFillFileEarmarkZipFill />;
    case 'image-file':
      return <BsFillFileEarmarkImageFill />;
    case 'crown':
      return <FaCrown />;
    default:
      return null;
  }
};

type IconButtonProps = {
  type: IconButtonTypes;
  size?: string;
  color?: string;
  className?: string;
  tooltipText?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const IconButton = ({
  type,
  size,
  color,
  className,
  tooltipText,
  onClick,
}: IconButtonProps) => {
  const iconStyles = useMemo(() => ({ color, size }), []);

  const icon = iconSwitch(type);
  if (!icon) return null;

  return (
    <>
      <button
        type="button"
        className={`${styles.iconButton} ${className}`}
        onClick={onClick}
        data-tip={tooltipText}
      >
        <IconContext.Provider value={iconStyles}>
          {icon}
        </IconContext.Provider>
      </button>
      {tooltipText && (
        <ReactTooltip
          place="right"
          type="dark"
          effect="solid"
          delayShow={200}
        />
      )}
    </>
  );
};

IconButton.defaultProps = {
  size: '26px',
  color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
  className: '',
  tooltipText: '',
};
