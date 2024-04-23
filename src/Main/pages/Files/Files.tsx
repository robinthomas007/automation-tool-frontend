import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchFiles, uploadFile } from "../../../redux/Slice/meSlice";

import { meSelector } from "../../../redux/Slice/meSlice";
import { Button, message, Upload } from "antd";
import { projectsSelector } from "../../../redux/Slice/projectsSlice";
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { getCookie } from "../../../Lib/auth";

const Files = () => {
  const dispatch = useAppDispatch();
  const { files } = useAppSelector(meSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);

  const props: UploadProps = {
    headers: {
      authorization: "Bearer "+getCookie('token'),
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        if(selectedProjects)
        dispatch(fetchFiles({projectId:selectedProjects.id}))
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  useEffect(()=>{
    if (selectedProjects)
    dispatch(fetchFiles({projectId:selectedProjects.id}))
  },[selectedProjects])
  return (
    <div> 
      <Upload {...props} name="file" action={`${process.env.REACT_APP_BASE_URL}/project/${selectedProjects?.id}/file`} showUploadList={false}>
        <Button icon={<UploadOutlined/>}>Click to Upload</Button>
      </Upload>
      <ul>
      {files.map(file=><li>{file.name}</li>)}
      </ul>
    </div>
  );
};

export default Files;
