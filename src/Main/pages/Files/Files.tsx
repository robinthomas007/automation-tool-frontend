import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { deleteFile, fetchFiles, uploadFile } from "../../../redux/Slice/meSlice";

import { meSelector } from "../../../redux/Slice/meSlice";
import { Button, List, message, Upload } from "antd";
import { projectsSelector } from "../../../redux/Slice/projectsSlice";
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { getCookie } from "../../../Lib/auth";
import {
  DeleteTwoTone,
} from '@ant-design/icons';
const Files = () => {
  const dispatch = useAppDispatch();
  const { files } = useAppSelector(meSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);

  const props: UploadProps = {
    headers: {
      authorization: "Bearer "+getCookie('token'),
    },
    onChange(info) {
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
      <List
            header={<div className='font-semibold'>Files</div>}
            bordered
            dataSource={files}
            renderItem={(item, index) => (
              <List.Item><div className="w-full flex flex-row"><span className="grow">{item.name}</span><DeleteTwoTone onClick={(e)=>{dispatch(deleteFile({fileId:item.id}))}} style={{ marginRight: 15 }} /></div></List.Item>
            )}
          />
    </div>
  );
};

export default Files;
