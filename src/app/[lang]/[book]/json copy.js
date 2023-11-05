
const fs = require("fs");

let allchapter = []
let levelprev = 0
let json = {}
let levelcount = []

function getJson(file, bookid) {
  const relevels = [3, 4, 9]
  let bookdata = file
  if (/\r/.test(bookdata)) {
    console.log('\\r\\n to \\n')
    process.exit(1)
  }

  const chaps = file.slice(0, file.indexOf('\n\n')).split("\n");


  let position = 0
  for (let i = 0; i < chaps.length; i++) {
    const level = chaps[i].search(/(?!　)/)
    if(levelcount[level] == undefined){
      levelcount[level] = 1
    }else{
      levelcount[level]++
    }
    let prevslug = i ? allchapter[i - 1].slug.slice(0, level) : [0]

    let item = {}

    const titlesplitter = "\n" + chaps[i].trim() + "\n"

    console.log(titlesplitter + ' ' + level)


    position = bookdata.indexOf(titlesplitter, position)
    item.position = position

    console.log(titlesplitter+position)
    console.log('level:'+level)

    if(position < 0){
      return ('未找到'+titlesplitter)
    }

    if(i+1 < chaps.length){
      const nextposition = bookdata.indexOf("\n" + chaps[i+1].trim() + "\n", position+titlesplitter.length)
      console.log('kkk')

      if(nextposition < position){
        return '未找到　'+chaps[i+1].trim()
      }
      item.length = nextposition - position
    }else{
      item.length = bookdata.length - position
    }

    if (levelprev < level) {
      if (relevels.includes(level)) levelcount[level] = 1
      item.slug = [...prevslug, levelcount[level]]
      item.id = i
      item.parent_id = (i - 1)
      item.title = chaps[i].trim()
      allchapter.push(item)
    } else if (levelprev > level) {
        item.slug = [...prevslug, levelcount[level]]
        item.id = i
        if(i>0)item.parent_id = getParent_id(i - 1, levelprev - level)
        item.title = chaps[i].trim()
        allchapter.push(item)
      } else {
        if (i > 0) {
          item.slug = [...prevslug, levelcount[level]]
          item.id = i
          item.parent_id = allchapter[i - 1].parent_id
          item.title = chaps[i].trim()
          allchapter.push(item)
        }
        else {
          item.slug = ['cn/' + bookid]
          item.id = i + ''
          item.parent_id = i
          item.title = chaps[i].trim()
          allchapter.push(item)
        }
      }

    levelprev = level


  }

  console.log(allchapter)

  return JSON.stringify(getTrees()[0])

}



function getTrees(pid = '') {
  if (!pid) {
    // 如果没有父id（第一次递归的时候）将所有父级查询出来
    return allchapter.filter(item => !item.parent_id).map(item => {
      // 通过父节点ID查询所有子节点
      let a = { slug: item.slug.join('/'), title: item.title, position:item.position, length:item.length }
      const n = getTrees(item.id)
      n == false ? '' : a.child = n
      return a
    })
  } else {
    return allchapter.filter(item => item.parent_id === pid).map(item => {
      // 通过父节点ID查询所有子节点
      let a = { slug: item.slug.join('/'), title: item.title, position:item.position, length:item.length }
      const n = getTrees(item.id)
      n == false ? '' : a.child = n
      return a
    })
  }
}


function getParent_id(i, count) {
  if (count) {
    return getParent_id(allchapter[i].parent_id, count - 1)
  }

  return allchapter[i].parent_id
}

module.exports = {
  getJson
}


// const rl = readline.createInterface({
//   input: fs.createReadStream(filepath),
//   output: process.stdout,
//   terminal: false
// })

// rl.on('line', (line) => {
//   console.log(line);
//   rl.close()
// });

function replaceChar(origString, replaceChar, index) {
  let firstPart = origString.substr(0, index);

  let lastPart = origString.substr(index + 1);

  let newString =
      firstPart + replaceChar + lastPart;

  return newString;
}
