import { NextRequest, NextResponse } from "next/server";

const MCP_BASE_URL = process.env.MCP_BASE_URL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const upstreamRes = await fetch(`${MCP_BASE_URL}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await upstreamRes.json();
    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: any) {
    console.error("[proxy /api/mcp] error", err);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
