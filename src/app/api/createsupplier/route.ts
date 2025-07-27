import connectDB from "@/utils/dbConnection";
import Supplier from "@/models/supplier.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";

const handler = asyncHandler(async (req: NextRequest) => {
  await connectDB();

  const data = await req.json();

  if (!data.shopName || !data.address || !data.category || !data.shopLocation || !data.user) {
    return ApiResponse.error("Missing required fields", 400);
  }

  const newSupplier = await Supplier.create({
    shopName: data.shopName,
    shopLocation: data.shopLocation,
    address: data.address,
    category: data.category,
    products: data.products || [],
    user: data.user,
  });

  return ApiResponse.success("Supplier created successfully", { newSupplier }, 201);
});

export { handler as POST };
