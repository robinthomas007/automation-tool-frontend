import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchAPIKeys, generateAPIKey } from "../../../redux/Slice/meSlice";

import { meSelector } from "../../../redux/Slice/meSlice";
import { Button } from "antd";
import { projectsSelector } from "../../../redux/Slice/projectsSlice";

const APIKeys = () => {
  const [search, setSearch] = useState('')

  const dispatch = useAppDispatch();
  const { apiKeys } = useAppSelector(meSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);
  useEffect(()=>{
    if (selectedProjects)
    dispatch(fetchAPIKeys({projectId:selectedProjects.id}))
  },[selectedProjects])
  return (
    <div>
      <Button onClick={(e)=>{
        if (selectedProjects){
          dispatch(generateAPIKey({projectId:selectedProjects.id}))
        }
      }}>Generate</Button>
      <ul>
      {apiKeys.map(key=><li>{key.key}</li>)}
      </ul>
      
    </div>
  );
};

export default APIKeys;
