import connectDB from "@/utils/dbConnection";
import Offer from "@/models/offers.model"
import { ApiResponse } from '@/utils/ApiResponse';
import Supplier from "@/models/supplier.model";

type Data =
  | { offers: any[] }
  | { message: string; error?: string };



const handler = async() => {
    await connectDB();
    try {
    const offers = await Offer.find().populate('supplier');
    console.log(offers)
      return ApiResponse.success("All offers: ",{offers},200)
    } catch (error: any) {
        return ApiResponse.error(`Server error : ${error.message}`,500)
    }
}

export {handler as GET}
