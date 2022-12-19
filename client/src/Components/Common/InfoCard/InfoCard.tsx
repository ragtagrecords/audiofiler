import React from 'react';
import './styles.scss';

type InfoCardSizes = 'large' | 'small';

type InfoCardProps = {
  title: string;
  info: string;
  isEditable: boolean;
  size?: InfoCardSizes;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

// TODO: fix the input , its showing NaN
export const InfoCard = ({
  title,
  info,
  isEditable,
  size,
  onChange,
}: InfoCardProps) => {
  let mainText;
  if (isEditable && size === 'large') {
    mainText = <textarea value={info} onChange={onChange} />;
  } else if (isEditable && size === 'small') {
    mainText = <input value={info} onChange={onChange} />;
  } else {
    mainText = <p> {info} </p>;
  }
  return (
    <div className={`info-card ${size === 'large' ? 'large' : ''}`}>
      <h1 className="small-header">{title}</h1>
      {mainText}
    </div>);
};

InfoCard.defaultProps = {
  size: 'small',
};
