import React from 'react'
import { Spin } from 'antd';

export default function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', position: 'absolute', left: '50%', top: 50 }}>
      <Spin size="large" />
    </div>
  );
}