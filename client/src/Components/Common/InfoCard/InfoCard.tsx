import React from 'react';
import './styles.scss';

type InfoCardProps = {
  title: string;
  info: string;
  isEditable: boolean;
  isLarge?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export const InfoCard = ({
  title,
  info,
  isEditable,
  isLarge,
  onChange,
}: InfoCardProps) => {
  let mainText;
  if (isEditable && isLarge) {
    mainText = <textarea value={info} onChange={onChange} />;
  } else if (isEditable) {
    mainText = <input value={info} onChange={onChange} />;
  } else {
    mainText = <p> {info} </p>;
  }
  return (
    <div className={`info-card ${isLarge ? 'large' : ''}`}>
      <h1>{title}</h1>
      {mainText}
    </div>);
};

InfoCard.defaultProps = {
  isLarge: false,
};
