// src/app/api/stt/route.ts
import { NextRequest, NextResponse } from "next/server";

const STT_URL = process.env.STT_BASE_URL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const upstream = await fetch(`${STT_URL}/stt_base64`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 필요하다면 인증 토큰도 붙이세요:
        // Authorization: `Bearer ${process.env.REMOTE_API_TOKEN}`
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[proxy /api/stt] error", err);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
