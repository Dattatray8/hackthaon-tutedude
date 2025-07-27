import connectDB from "@/utils/dbConnection";
import Offer from "@/models/offers.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

const handler = asyncHandler(async () => {
  await connectDB();

  const offers = await Offer.find();

  return ApiResponse.success("All offers fetched successfully", { offers }, 200);
});

export { handler as GET };
