import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import './UploadArea.scss';

type UploadAreaProps = {
  handleUpload: React.ChangeEventHandler<HTMLInputElement>;
}

export const UploadArea = ({ handleUpload }: UploadAreaProps) => {
  const iconStyles = useMemo(() => ({
    color: '#1d1d1d', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '25px',
  }), []);

  return (
    <label className="uploadArea">
      <IconContext.Provider value={iconStyles}>
        <AiOutlineCloudUpload />
      </IconContext.Provider>
      Upload
      <input type="file" onChange={handleUpload} multiple />
    </label>
  );
};
