import {
  FolderTwoTone,
  FolderOpenTwoTone,
} from '@ant-design/icons';
import { AntTreeNodeProps } from 'antd/es/tree';
export const HToTD=(h:any)=>{
  const data=h.children?h.children.map((f:any)=>NodeMap(f)):[]
  return data 
}
const NodeMap=(n:any)=>{
  return {
    value:n.id,
    title:n.name,
    switcherIcon:(props:AntTreeNodeProps)=>(props.expanded?<FolderOpenTwoTone/>:<FolderTwoTone/>),
    children: n.children?n.children.map((f:any)=>NodeMap(f)):[]
  }
}
export const Hierarchy = (arr: any,extra:object) => {
    const mapped = arr?arr.map((f: any) => ({ ...f, children: [] })):[]
    const h: any = {
      children: []
    }
    const getOrPush = (a: any) => {
      if (h.children.find((f: any) => f.id == a.id)) {
        return a
      }
      if (a.parent_id == null || a.parent_id == undefined) {
        h.children.push(a)
        return a
      } else {
        const r: any = getOrPush(mapped.find((f: any) => f.id == a.parent_id));
        const fnd: any = r.children.find((f: any) => f.id == a.parent_id)
        if (fnd) {
          return fnd
        } else {
          r.children.push(a)
          return a
        }
      }
    }
    for (const i of mapped) {
      getOrPush(i)
    }
    return {...h,...extra}
  
}
const sanitizeNode=(node:any)=>{
  if(node.isLeaf){
    return node
  } else if(node.children){
    const childs=node.children.map((c:any)=>sanitizeNode(c)).filter((n:any)=>n!=null)
    if (childs.length!=0){
      return {...node,childrens:childs}
    } else {
      return null
    }
  } else {
    return null
  }
}
export const SanitizeTreeData=((td:any[])=>{
  return td.map((n:any)=>sanitizeNode(n)).filter((n:any)=>n!=null)
})
