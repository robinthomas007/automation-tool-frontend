import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchFiles, uploadFile } from "../../../redux/Slice/meSlice";

import { meSelector } from "../../../redux/Slice/meSlice";
import { Button, Input, Upload } from "antd";
import { projectsSelector } from "../../../redux/Slice/projectsSlice";

const Files = () => {
  const [file,setFile]=useState<File|null>(null)
  const dispatch = useAppDispatch();
  const { files } = useAppSelector(meSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);
  useEffect(()=>{
    if (selectedProjects)
    dispatch(fetchFiles({projectId:selectedProjects.id}))
  },[selectedProjects])
  return (
    <div> 
      <ul>
      {files.map(file=><li>{file.name}</li>)}
      </ul>
    </div>
  );
};

export default Files;
