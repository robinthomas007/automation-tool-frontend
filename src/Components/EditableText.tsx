import React, { useCallback, useEffect, useState } from 'react';
import { CheckSquareFilled } from '@ant-design/icons'

const EditableText = ({ initialText, defaultText, onChange }: { defaultText: string, initialText: string, onChange: (e: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const finalizeValue = useCallback(()=>{
    if (text.trim().length === 0){
      setText(initialText)
    }
    setIsEditing(false)
    onChange(text.trim())
      
  },[text,initialText])
  const handleClick = useCallback(() => {
    setIsEditing(true)
  },[text]);

  const handleChange = (event: any) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    finalizeValue()
  };

  return (
    <div onClick={handleClick}>
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          className='p-0 mx-2'
        />
      ) : (
        <a>{text === "" || text == null ? defaultText : text}</a>
      )}{isEditing && <CheckSquareFilled style={{ color: 'green' }} onClick={(e) => {
        e.stopPropagation()
        handleBlur()
      }} />}
    </div>
  );
};

export default EditableText;
