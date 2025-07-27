import connectDB from "@/utils/dbConnection";
import Supplier from "@/models/supplier.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

const handler = asyncHandler(async (req) => {
  await connectDB();

  // ✅ Extract userId from query
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user");

  if (userId) {
    const supplier = await Supplier.findOne({ user: userId }).populate("user", "-password");

    if (!supplier) {
      return ApiResponse.error("Supplier not found", 404);
    }

    return ApiResponse.success("Supplier fetched successfully", { supplier }, 200);
  }

  // ✅ If no userId param, return all suppliers (fallback)
  const suppliers = await Supplier.find().populate("user", "-password");
  return ApiResponse.success("All suppliers fetched successfully", { suppliers }, 200);
});

export { handler as GET };
