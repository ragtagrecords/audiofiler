import React from 'react';
import styles from './EditableTitle.module.scss';

type EditableTitleProps = {
  value: string;
  isEditable: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export const EditableTitle = ({
  value, isEditable, onChange, onSubmit,
}: EditableTitleProps) => {
  return (
    <form onSubmit={onSubmit} className={styles.editableTitle}>
      <input
        value={value}
        onChange={onChange}
        disabled={!isEditable}
      />
      <button aria-label="submit" type="submit" />
    </form>
  );
};
