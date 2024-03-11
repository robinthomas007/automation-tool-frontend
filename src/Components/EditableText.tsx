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
    console.log("Blurred")
    setIsEditing(false);
  };
  useEffect(() => {
    if (isEditing === false) {
      onChange(text)
    }
  }, [isEditing])

  return (
    <div onClick={handleClick} style={{ marginRight: 5, marginLeft: 5 }}>
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      ) : (
        <a>{text === "" ? defaultText : text}</a>
      )}{isEditing && <CheckSquareFilled style={{ color: 'green' }} onClick={(e) => {
        e.stopPropagation()
        handleBlur()
      }} />}
    </div>
  );
};

export default EditableText;
