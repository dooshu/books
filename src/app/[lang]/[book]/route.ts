import a from "@/components/a"
import { promises as fs } from 'fs';
import { useParams } from "next/navigation"

export async function GET(request: Request, params:any) {
  const lang = params.params.lang
  const book = params.params.book
  const [bookid, bookext] = book.split('.')

  const filepath = process.cwd()+'/public/'+lang+'/'+bookid+'.txt'
  const file = await fs.readFile(filepath, 'utf8')

  if(bookext === 'json'){
    const json = require('./json')
    const j = json.getJson(file, bookid)
    fs.writeFile(process.cwd()+'/public/'+lang+'/'+bookid+'.json', j)

    return new Response(j)
  }



  return new Response(file)


}




