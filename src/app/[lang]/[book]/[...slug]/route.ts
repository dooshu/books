import a from "@/components/a"
import { promises as fs } from 'fs';
import { useParams } from "next/navigation"

export async function GET(request: Request, params:any) {
  const file = await fs.readFile(process.cwd()+`/public/cn/1.txt`, 'utf8')

  return new Response(file)
}