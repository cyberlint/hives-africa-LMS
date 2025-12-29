export async function POST(req: Request) {
  const { notebookUrl } = await req.json();

  const res = await fetch("http://localhost:8001/render", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      notebook_url: notebookUrl
    })
  });

  if (!res.ok) {
    return new Response("Failed to render", { status: 500 });
  }

  const data = await res.json();
  return Response.json(data);
}