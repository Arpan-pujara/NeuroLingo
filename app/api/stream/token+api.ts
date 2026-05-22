import { requireClerkUserId } from "@/lib/clerk-api-auth";
import { getStreamServerClient } from "@/lib/stream-server";

type TokenRequestBody = {
  name?: string;
  imageUrl?: string;
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.STREAM_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "STREAM_API_KEY is not configured." }, { status: 500 });
    }

    const userId = await requireClerkUserId(request);
    const body = (await request.json().catch(() => ({}))) as TokenRequestBody;

    const client = getStreamServerClient();
    await client.upsertUsers([
      {
        id: userId,
        role: "user",
        name: body.name?.trim() || "Learner",
        image: body.imageUrl,
      },
    ]);

    const token = client.generateUserToken({
      user_id: userId,
      validity_in_seconds: 60 * 60,
    });

    return Response.json({ token, apiKey, userId });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("[api/stream/token]", error);
    return Response.json({ error: "Failed to create Stream token." }, { status: 500 });
  }
}
