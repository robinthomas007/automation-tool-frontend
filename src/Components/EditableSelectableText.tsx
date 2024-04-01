import React, { useEffect, useState } from 'react';
import { CheckSquareFilled } from '@ant-design/icons'
import { Select } from 'antd';

const EditableSelectableText = ({ value, onChange, options }: { value: number, onChange: (e: number) => void, options: { label: string, value: number }[]}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState<string>(options.find(o=>o.value==value)?.label??'Select One');
  function onClickStopProg(e: any) {
    e.stopPropagation();
  }
  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (val: number) => {
    setText(options.find(o=>o.value==val)?.label??'Select One');
    handleBlur();
  };

  const handleBlur = () => {
    setIsEditing(false);
  };
  useEffect(() => {
    if (isEditing === false) {
      onChange(options.find(o=>o.label==text)?.value??0)
    }
  }, [isEditing])

  return (
    <div onClick={handleClick}>
      {isEditing ? (
        <Select
          onClick={onClickStopProg}
          style={{ width: 120 }}
          options={options}
          onChange={handleChange}
          value={value}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <a>{text}</a>
      )}
    </div>
  );
};

export default EditableSelectableText;
