import connectDB from "@/utils/dbConnection";
import Offer from "@/models/offers.model"
import { ApiResponse } from '@/utils/ApiResponse';

const handler = async(req:any) => {
  await connectDB();
    try {
      const data = await req.json();

      if (!data.fromDate || !data.toDate || !data.offerOn || !data.supplier) {
        return ApiResponse.error("Missing required fields",400)
      }

      const newOffer = await Offer.create({
        fromDate:data.fromDate,
        toDate:data.toDate,
        offerOn:data.offerOn,
        notes:data.notes,
        supplier:data.supplier
      });

      return ApiResponse.success("offer created",{newOffer},201)
    } catch (error: any) {
      return ApiResponse.error(`Server error : ${error.message}`,500);
    }
}

export {handler as POST}