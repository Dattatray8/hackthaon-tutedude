import { asyncHandler } from "@/utils/asyncHandler";
import { verifyJWT } from "@/utils/verifyJWT";
import { NextResponse } from "next/server";
import { getUserById } from "@/helpers/server/auth"; // Adjust path as needed

const getCurrentUser = asyncHandler(async (req) => {
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
        return NextResponse.json({ error: "No access token provided" }, { status: 401 });
    }

    const { error, payload } = await verifyJWT(String(accessToken), "access");
    if (error || !payload) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Assuming payload contains userId
    const user = await getUserById(payload?._id as string);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
});

export { getCurrentUser as GET };