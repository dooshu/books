const { AssertionError } = require("assert");
const { assert } = require("console");
const fs = require("fs");
const path = require("path");
const { exec, spawn } = require('child_process');

let allchapter = []

function getJson(bookdata, bookid) {
  const relevels = [2, 3, 4]

  if (/\r/.test(bookdata)) {
    console.log('\\r\\n to \\n')
    process.exit(1)
  }


  const chaps = /(.*?)\n\n/s.exec(bookdata)[0].trim().split("\n");



  bookdata = bookdata.replace(chaps[0], chaps[0] + '\n```')

  const pos = chaps.join('\n').length + 4
  bookdata = [bookdata.slice(0, pos), '\n```', bookdata.slice(pos)].join("");


  let i = 0;
  let bookdata2 = bookdata
  for (i = 1; i < chaps.length; i++) {

    const nextindex = bookdata2.indexOf("\n" + chaps[i].trim() + "\n")
    bookdata2 = bookdata2.substring(nextindex + chaps[i].length);



    if (nextindex < 0) {
      console.log(chaps[i] + "　未找到 " + (i + 1));
      process.exit(1);
    }
  }



  let levelprev = 0
  let json = {}
  let levelcount = []
  for (i = 0; i < chaps.length; i++) {
    const level = chaps[i].search(/(?!　)/);
    levelcount[level] == undefined ? levelcount[level] = (chaps[i].trim() === '0' ? 0 : 1) : levelcount[level]++
    let prevslug = i ? allchapter[i - 1].slug.slice(0, level) : [0]

    if (levelprev < level) {
      if (relevels.includes(level + '')) levelcount[level] = 1

      allchapter.push({ slug: [...prevslug, levelcount[level]], id: i + '', parent_id: (i - 1) + '', title: chaps[i].trim() })
    } else
      if (levelprev > level) {

        allchapter.push({ slug: [...prevslug, levelcount[level]], id: i + '', parent_id: getParent_id(i - 1, levelprev - level), title: chaps[i].trim() })
      } else {
        if (i > 0)
          allchapter.push({ slug: [...prevslug, levelcount[level]], id: i + '', parent_id: i ? allchapter[i - 1].parent_id + '' : '', title: chaps[i].trim() })
        else
          allchapter.push({ slug: ['cn/' + bookid], id: i + '', parent_id: i ? allchapter[i - 1].parent_id + '' : '', title: chaps[i].trim() })
      }

    levelprev = level



    let nextChapsIndex = i + 1
    if (i < chaps.length - 1) {
      while (chaps[nextChapsIndex].trim() === '0') {
        nextChapsIndex++
      }
    }



    const nextindex1 = i < chaps.length - 1 ? bookdata.indexOf("\n" + chaps[nextChapsIndex].trim() + "\n") : bookdata.length;

    const nextindex = nextindex1 != 0 ? nextindex1 : i < chaps.length - 1 ? bookdata.indexOf("\n" + chaps[nextChapsIndex].trim() + "\n", chaps[nextChapsIndex].length) : bookdata.length;


    if (nextindex <= 0) {
      console.log(i + ' nextindex wrong ' + nextindex + chaps[i].trim())
      process.exit(1)
    }

    bookdata = bookdata.substring(nextindex);

  }

  return getTrees()

}




function getTrees(pid = '') {
  if (!pid) {

    return allchapter.filter(item => !item.parent_id).map(item => {

      let a = { slug: item.slug.join('/'), title: item.title }
      const n = getTrees(item.id)
      n == false ? '' : a.child = n
      return a
    })
  } else {
    return allchapter.filter(item => item.parent_id === pid).map(item => {

      let a = { slug: item.slug.join('/'), title: item.title }
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