
　//👉　{start:2019}
export default function getJson(file:string, lang:string, bookid:number) {
  if(/\r/.test(file)){
    return 'wrong \\r\\n to \\n'
    file = file.replaceAll('\r\n', '\n')
  }
  let position = file.indexOf("\n\n")
  const chapters: string[] = file.slice(0, position).split("\n");
  if(chapters.length < 3 || chapters[1][0] !== '　'){
    return 'wrong 没有目录'
  }
  position = file.indexOf("\nÁÁÁÁÁÁÁÁÁÁ：doosho.com", position)
  let continuing:number[] = []  // 哪一级菜单编号是连续的，比如如果包含2，侧第二部第五回、第三部则是从第六回开始
  //let startnumber:number[] = [] // 编号从多少开始，默认是1，比如[1，1，2019]，第三级菜单从2019开始
  let openlevel:number[] = [] // 哪一级菜单标记 open:true
  let initialnumber:string[] = [] // 父级别-父编号-子初始值，比如1-2019-7为第一级编号为2019时，子级从7开始
  if(position > 0){
    position =  position+22
    continuing = file.substring(position, file.indexOf("\n\n", position)).replace(/\s/g, "").split('，').map(Number)
    position = file.indexOf("\nББББББББББ：doosho.com", position)
    position =  position+22
    // startnumber = file.substring(position, file.indexOf("\n\n", position)).replace(/\s/g, "").split('，').map(Number)
    // position = file.indexOf("\nĆĆĆĆĆĆĆĆĆĆ：doosho.com", position)
    // position =  position+22
    openlevel = file.substring(position, file.indexOf("\n\n", position)).replace(/\s/g, "").split('，').map(Number)
    position = file.indexOf("\ĎĎĎĎĎĎĎĎĎĎ：doosho.com", position)
    position =  position+22
    initialnumber = file.substring(position, file.indexOf("\n\n", position)).replace(/\s/g, "").split('，')
  }else{
    position = file.indexOf("\n\n")
  }
  let levelcount: number[] = []; //标记同一级菜单的第几个，比如“第二卷”标记为2，“第一百二十回”标记为120
  let oldlevel = 0;
  let levelpid: number[] = []; //记录同一级菜单的pid
  let allchapter: any = [];
  position = file.indexOf('\n'+chapters[0].trim()+'\n', 0)
  let nextposition = file.indexOf('\n'+chapters[1].trim()+'\n', position)
  const result = {
    slug: "/"+lang+"/" + bookid,
    title: chapters[0],
    position: position,
    length: nextposition - position,
    child: []
  }

  if(position < 0){
    return 'wrong'+chapters[0] + `　　第1行`
  }

  if(result.length < 0){
    return 'wrong'+chapters[1] + `　　第2行`
  }

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i].trim();
    //const level = chapter.search(/(?!　)/);
    const level = chapters[i].search(/[^　]/);
    position = file.indexOf('\n'+chapter+'\n', position)

    let item:any = {
      slug: "/"+lang,
      title: chapter,
      position: position,
      length: 0,
      id: i,
      pid: 0,
    };
    if (!levelcount[level]) levelcount[level] = 0;
    levelcount[level]++;

    if(i<chapters.length-1){
      nextposition = file.indexOf('\n'+chapters[i+1].trim()+'\n', position+chapter.length)
    }else{
      nextposition = file.length
    }

    if (level === oldlevel + 1) {
      if(continuing.includes(level)){
        levelcount[level] = 1
      }
      initialnumber.map(v=>{
        const renow = v.split('-').map(Number)
        const parentlevel = renow[0]
        const parentindex = renow[1]
        const childfirstnumber = renow[2]

        if(parentlevel===level-1 && parentindex===levelcount[level-1]){
          levelcount[level] = childfirstnumber
        }
      })

      // if(startnumber[i-1]){
      //   levelcount[level] = startnumber[i-1]
      // }
      if(openlevel.includes(level)){
        item['open'] = true
      }
    }

    item.slug = "/"+lang+"/" + bookid + "/" + levelcount.slice(1, level+1).join("/")
    item.length = nextposition - position
    

    if(position < 0){
      return 'wrong'+chapter + `　　第${i+1}行`
    }
    if(item.length < 0){
      return 'wrong'+chapters[i+1] + `　　第${i+2}行`
    }


    if (level === oldlevel + 1) {
      levelpid[level] = i - 1;
      item.pid = levelpid[level];
      allchapter = [...allchapter, item]
    }

    if (oldlevel === level) {
      item.pid = levelpid[level];
      allchapter = [...allchapter, item]
    }

    if (level < oldlevel) {
      item.pid = levelpid[level];
      allchapter = [...allchapter, item]
    }

    oldlevel = level;
  }
  


  result.child = getTrees(allchapter)
  return JSON.stringify(result);
}

function getTrees(allchapter:any, pid = 0) {
    return allchapter.filter((item:any) => item.pid === pid).map((item:any) => {
      // 通过父节点ID查询所有子节点
      let a:any = { slug: item.slug, title: item.title.trim(), position:item.position, length:item.length }
      if(item.open)a.open=item.open
      const n = getTrees(allchapter, item.id)
      n == false ? '' : a.child = n
      return a
    })
}


// const arrayToTree = (arr, pid = 0) =>
// arr.filter((item) => item.pid === pid)
//   .map((child) => {
//     const t = arrayToTree(arr, child.id)
//     return { ...child, child: t }
//   });