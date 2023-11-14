import a from "@/components/a"
import { promises as fs } from 'fs';
import getJson from "./json";

export async function GET(request: Request, {params}:any) {
  const lang = params.lang
  const book = params.book
  const [bookid, bookext] = book.split('.')
  //const { searchParams } = new URL(request.url)

  const filepath = process.cwd()+'/public/'+lang+'/'+bookid+'.txt'
  const file = await fs.readFile(filepath, 'utf8').then(async v=>{
    if(/\r/.test(v)){
      const tmpdata = v.replaceAll('\r\n', '\n')
      await fs.writeFile(filepath, tmpdata)
      return tmpdata
    }
    return v
  })



  //if(bookext === 'json'){
    if(bookid){
      const j = await getJson(file, bookid)
    //fs.writeFile(process.cwd()+'/public/'+lang+'/'+bookid+'.json', j)

    //return new Response(JSON.stringify(j))
    return new Response(j)
  }

  return new Response(file.slice(0, file.indexOf('\n\n')))
}



function testJSON(text:any) {
  if (typeof text !== "string") {
      return false;
  }
  try {
      JSON.parse(text);
      return true;
  } catch (error) {
      return false;
  }
}
