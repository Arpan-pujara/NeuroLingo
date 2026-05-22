import { StreamClient } from "@stream-io/node-sdk";

let streamServerClient: StreamClient | null = null;

export function getStreamServerClient(): StreamClient {
  if (streamServerClient) {
    return streamServerClient;
  }

  const apiKey = process.env.STREAM_API_KEY;
  const apiSecret = process.env.STREAM_SECRET_KEY;

  if (!apiKey || !apiSecret) {
    throw new Error(
      "STREAM_API_KEY and STREAM_SECRET_KEY must be set for Stream API routes.",
    );
  }

  streamServerClient = new StreamClient(apiKey, apiSecret);
  return streamServerClient;
}
