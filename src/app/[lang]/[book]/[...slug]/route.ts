import a from "@/components/a"
import { promises as fs } from 'fs';
import { redirect, useParams } from "next/navigation"

export async function GET(request: Request, {params}:any) {
  const lang = params.lang
  const book = params.book
  const [bookid, bookext] = book.split('.')
  const position = params.slug[0]
  const length = params.slug[1]
  const filepath = process.cwd()+'/public/'+lang+'/'+bookid+'.txt'
  const file = await fs.readFile(filepath, 'utf8')

  //return new Response(file.substring(position, parseInt(position)+parseInt(length)).trim())
  return new Response(file.slice(position, parseInt(position)+parseInt(length)).trimStart())
}


export async function POST(request: Request, {params}:any) {
  const lang = params.lang
  const book = params.book
  const [bookid, bookext] = book.split('.')
  const position = params.slug[0]
  const length = params.slug[1]
  const filepath = process.cwd()+'/public/'+lang+'/'+bookid+'.txt'
  const file = await fs.readFile(filepath, 'utf8')
  const firstpart = file.slice(0, position)
  const lastpart = file.slice(parseInt(position)+parseInt(length))
  const formdata = await request.formData()

  fs.writeFile(filepath, firstpart+formdata.get('kkk')+lastpart)  

  //return new Response(file.substring(position, parseInt(position)+parseInt(length)).trim())
  return new Response('aaaa')
}



