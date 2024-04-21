import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchAPIKeys, generateAPIKey } from "../../../redux/Slice/meSlice";

import { meSelector } from "../../../redux/Slice/meSlice";
import { Button } from "antd";

const APIKeys = () => {
  const [search, setSearch] = useState('')

  const dispatch = useAppDispatch();
  const { apiKeys } = useAppSelector(meSelector);
  useEffect(()=>{
    dispatch(fetchAPIKeys())
  },[])
  return (
    <div>
      <Button onClick={(e)=>{
        dispatch(generateAPIKey())
      }}>Generate</Button>
      <ul>
      {apiKeys.map(key=><li>{key.key}</li>)}
      </ul>
      
    </div>
  );
};

export default APIKeys;
