import connectDB from "@/utils/dbConnection";
import User from "@/models/user.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

const handler = asyncHandler(async () => {
  await connectDB();

  const suppliers = await User.find({ role: "supplier" }).select("-password");

  return ApiResponse.success("Suppliers fetched successfully", { suppliers }, 200);
});

export { handler as GET };
