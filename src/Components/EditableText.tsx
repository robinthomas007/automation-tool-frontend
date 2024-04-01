import React, { useEffect, useState } from 'react';
import { CheckSquareFilled } from '@ant-design/icons'

const EditableText = ({ initialText,defaultText, onChange }: { defaultText:string,initialText: string, onChange: (e: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: any) => {
    setText(event.target.value);
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
    <div onClick={handleClick}>
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      ) : (
        <a>{text == ""||text==null ? defaultText : text}</a>
      )}{isEditing && <CheckSquareFilled style={{ color: 'green' }} onClick={(e) => {
        e.stopPropagation()
        handleBlur()
      }} />}
    </div>
  );
};

export default EditableText;
