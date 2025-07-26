import connectDB from "@/utils/dbConnection";
import Offer from "@/models/offers.model";
import { ApiResponse } from "@/utils/ApiResponse";

export async function DELETE(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return ApiResponse.error("Offer id required", 400);
    }

    const deleted = await Offer.findByIdAndDelete(id);
    if (!deleted) {
      return ApiResponse.error("Offer not found", 404);
    }

    return ApiResponse.success("Offer deleted", 200);
  } catch (error: any) {
    return ApiResponse.error(`Server error: ${error.message}`, 500);
  }
}
