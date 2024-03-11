import React, { useEffect, useState } from 'react';
import { CheckSquareFilled } from '@ant-design/icons'
import { Select } from 'antd';

const EditableSelectableText = ({ value, onChange, options }: { value: string, onChange: (e: string) => void, options: { label: string, value: string }[] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  function onClickStopProg(e: any) {
    e.stopPropagation();
  }
  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (val: string) => {
    setText(val);
    handleBlur();
  };

  const handleBlur = () => {
    setIsEditing(false);
  };
  useEffect(() => {
    if (isEditing === false) {
      onChange(text)
    }
  }, [isEditing])

  return (
    <div onClick={handleClick} style={{ marginRight: 5 }}>
      {isEditing ? (
        <Select
          onClick={onClickStopProg}
          style={{ width: 120 }}
          options={options}
          onChange={handleChange}
          value={text}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <a>{text}</a>
      )}
    </div>
  );
};

export default EditableSelectableText;
