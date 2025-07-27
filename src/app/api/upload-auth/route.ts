// File: app/api/upload-auth/route.ts
import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    return NextResponse.json(
      { message: "Missing ImageKit credentials." },
      { status: 500 }
    );
  }

  try {
    const { token, expire, signature } = await getUploadAuthParams({
      privateKey,
      publicKey,
    });
    
    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });
  } catch (error) {
    console.error("ImageKit auth error:", error);
    return NextResponse.json(
      { message: "Failed to generate upload credentials." },
      { status: 500 }
    );
  }
}
