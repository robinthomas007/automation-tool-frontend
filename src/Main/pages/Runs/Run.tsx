import { RunDataItem, Run as RunModel } from "../../../redux/Slice/runsSlice";
import { Row, Col, List, Typography, Collapse, Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled,ClockCircleOutlined,QuestionCircleOutlined, LoadingOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Tree, } from 'antd';
import ReactPlayer from "react-player";

const { Title } = Typography
const Icon = ({status}:{status:string})=>{
  switch(status){
    case 'PASS':
      return <CheckCircleFilled style={{ color: 'green' }} />
    case 'FAIL':
      return <CloseCircleFilled style={{ color: 'red' }} />
    case 'SKIPPED':
      return <MinusCircleOutlined style={{ color: 'grey' }} /> 
    case 'IN_PROGRESS':
      return <LoadingOutlined style={{ color: 'blue' }} />
    case 'SCHEDULED':
      return <ClockCircleOutlined style={{ color: 'blue' }} />
    default:
      return <QuestionCircleOutlined style={{ color: 'red' }} />
  }
}
const downloadFile = ({ data, fileName, fileType }:any) => {
  // Create a blob with the data we want to download as a file
  const blob = new Blob([data], { type: fileType })
  // Create an anchor element and dispatch a click event on it
  // to trigger a download
  const a = document.createElement('a')
  a.download = fileName
  a.href = window.URL.createObjectURL(blob)
  const clickEvt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  a.dispatchEvent(clickEvt)
  a.remove()
}

const Run = ({ run }: { run: RunModel }) => {
  
  const exportToJson = (e:any) => {
    e.preventDefault()
    downloadFile({
      data: JSON.stringify(run),
      fileName: `${run.id}.json`,
      fileType: 'text/json',
    })
  } 
  return (
    <div className="data">
      <Button onClick={exportToJson}>Download</Button>
      {run.result.type=='Suite'?
        <Collapse style={{minHeight:'100%'}} defaultActiveKey={run.result.items.length>0?run.result.items[0].id:0}>
          {run&& run.result&&run.result.items && run.result.items.map(i=><Collapse.Panel key={i.id} header={<div><span><Icon status={i.status}/></span><span> {i.name}</span></div>}>
          {i && <RunItem item={i} />}
          {i.video && i.video.map(vurl=><ReactPlayer url={vurl} controls={true}/>)}
          </Collapse.Panel>)}
        </Collapse>        
:
      <Collapse style={{minHeight:'100%'}} defaultActiveKey={run.result.id>0?run.result.id:0}>
          <Collapse.Panel key={run.result.id} header={<div><span><Icon status={run.result.status}/></span><span> {run.result.name}</span></div>}>
          {run.result && <RunItem item={run.result} />}
          {run.result.video && run.result.video.map(vurl=><ReactPlayer url={vurl} controls={true}/>)}
          </Collapse.Panel>
        </Collapse>  
      }
  </div>)
};

const RunItem = ({ item }: { item: RunDataItem }) => {
  const constructTreeNodes = (data: any, parentKey: string) => {
    if (!data) {
      return null
    }
    return data.items.map((item: any, index: any) => ({
      title: (
        <span>
          <span>{item.error !== "" && item.type === 'ResourceElementAction' ? "Expected:" : ""}{item.name}{item.error !== "" && item.type === 'ResourceElementAction' ? ", Actual: " + item.error : ""} ({item.time}) </span>
          {item.screenshot && <span style={{ display: 'block', padding: 10 }}>
            <img src={item.screenshot} alt="Screenshot" style={{ maxWidth: '100%', marginTop: 10, marginBottom: 10, border: '1px solid #ddd' }} />
          </span>}
          {item.video && item.video.map((vurl:string)=><span style={{ display: 'block', padding: 10 }}>
          <ReactPlayer url={vurl} controls={true}/>
          </span>)}
        </span>
      ),
      key: `${parentKey}-${item.id}-${item.sequence_number}`,
      icon: <Icon status={item.status}/>,
      children: item.items.length > 0 ? constructTreeNodes(item, `${parentKey}-${item.id}-${item.sequence_number}`) : null,
    }));
  };

  const newTreeData = item ? constructTreeNodes(item, '') : constructTreeNodes(null, '')

  const updatedTreeData = newTreeData && newTreeData.map((node: any, index: any) => {
    if (newTreeData[index]) {
      return {
        ...node,
        children: newTreeData[index].children,
      };
    }
    return node;
  });
  const onSelect = (selectedKeys: React.Key[], info: any) => {
  };

  return <div>
    <Tree
      showLine={true}
      showIcon={true}
      defaultExpandAll={true}
      onSelect={onSelect}
      treeData={updatedTreeData}
      style={{ padding: '10px' }}
    />
  </div>
}

export default Run;
