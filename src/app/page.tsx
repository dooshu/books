import Image from "next/image";

export default async function Home() {
  const text = await fetch('http://localhost:3000/cn/1/23854/10332')

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action="/cn/1/23854/10332" method="post">
        <textarea defaultValue={await text.text()} name="kkk"></textarea>
        <input type="submit" value="Submit" />
      </form>
    </main>
  );
}
