export async function parseJsonBody<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }
}
