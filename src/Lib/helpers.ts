export const TestsFromFolder=(f:any):any[]=>{
  var tests:any[] = []
  if (f.tests){
    tests = [...f.tests]
  }
  if (f.children){
    for(const ch of f.children){
      tests = [...tests,...TestsFromFolder(ch)]
    }
  }
  return tests
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
