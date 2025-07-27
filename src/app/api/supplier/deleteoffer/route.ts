import connectDB from "@/utils/dbConnection";
import Offer from "@/models/offers.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";

const handler = asyncHandler(async (req: NextRequest) => {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return ApiResponse.error("Offer id required", 400);
  }

  const deleted = await Offer.findByIdAndDelete(id);
  if (!deleted) {
    return ApiResponse.error("Offer not found", 404);
  }

  return ApiResponse.success("Offer deleted successfully", {}, 200);
});

export { handler as DELETE };
