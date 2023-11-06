
　//👉　{start:2019}
export default function getJson(file: string, bookid: number) {
  let position = file.indexOf("\n\n")
  const chapters: string[] = file.slice(0, position).split("\n");
  position = file.indexOf("\nÁÁÁÁÁÁÁÁÁÁ：doosho.com", position)
  let continuing:number[] = []
  let startnumber:number[] = []
  if(position > 0){
    position =  position+22
    continuing = file.substring(position, file.indexOf("\n\n", position)).replace(/\s/g, "").split('，').map(Number)
    position = file.indexOf("\nББББББББББ：doosho.com", position)
    position =  position+22
    startnumber = file.substring(position, file.indexOf("\n\n", position)).replace(/\s/g, "").split('，').map(Number)
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
    slug: "/cn/" + bookid,
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
    const chapter = chapters[i];
    const level = chapter.search(/(?!　)/);
    if (!levelcount[level]) levelcount[level] = 0;
    levelcount[level]++;

    position = file.indexOf('\n'+chapter.trim()+'\n', position)
    if(i<chapters.length-1){
      nextposition = file.indexOf('\n'+chapters[i+1].trim()+'\n', position+chapter.length)
    }else{
      nextposition = file.length
    }

    if (level === oldlevel + 1) {
      if(continuing.includes(level)){
        console.log(continuing+'...'+level)
        levelcount[level] = 1
      }
      if(startnumber[i-1]){
        console.log(startnumber[i-1])
        levelcount[level] = startnumber[i-1]
      }
    }

    let item = {
      slug: "/cn/" + bookid + "/" + levelcount.slice(1, level+1).join("/"),
      title: chapter,
      position: position,
      length: nextposition-position,
      id: i,
      pid: 0,
    };

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