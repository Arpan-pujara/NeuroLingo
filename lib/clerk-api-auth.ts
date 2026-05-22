import { verifyToken } from "@clerk/backend";

function unauthorizedResponse(message = "Unauthorized") {
  return Response.json({ error: message }, { status: 401 });
}

export async function requireClerkUserId(request: Request): Promise<string> {
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    throw Response.json(
      { error: "CLERK_SECRET_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw unauthorizedResponse("Missing Authorization bearer token.");
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    throw unauthorizedResponse();
  }

  try {
    const payload = await verifyToken(token, { secretKey });
    if (!payload.sub) {
      throw unauthorizedResponse("Invalid session token.");
    }
    return payload.sub;
  } catch {
    throw unauthorizedResponse("Invalid or expired session token.");
  }
}
