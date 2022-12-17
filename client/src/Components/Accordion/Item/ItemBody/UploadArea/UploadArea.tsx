import { IconButton } from 'Components/Common/IconButton/IconButton';
import React, { useRef } from 'react';
import './UploadArea.scss';

type UploadAreaProps = {
  handleUpload: React.ChangeEventHandler<HTMLInputElement>;
}

export const UploadArea = ({ handleUpload }: UploadAreaProps) => {
  const ref: React.RefObject<HTMLInputElement> = useRef(null);

  return (
    <div className="upload-area">
      <IconButton
        type="upload"
        tooltipText="Upload a new version"
        size="25px"
        onClick={() => {
          if (ref.current) ref.current.click();
        }}
      />
      <input
        id="file-input"
        ref={ref}
        type="file"
        onChange={handleUpload}
        multiple
      />
    </div>
  );
};
