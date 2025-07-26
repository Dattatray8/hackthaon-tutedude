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

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   if (req.method === 'GET') {
//     await connectDB();

//     try {
//       // Fetch all offers and populate the supplier details
//       const offers = await Offer.find().populate('supplier');
//       return res.status(200).json({ offers });
//     } catch (error: any) {
//       return res.status(500).json({ message: 'Server Error', error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['GET']);
//     return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//   }
// }


// const handler = async(req:any) => {
//   await connectDB();
//     try {
//       const data = await req.json();

//       if (!data.fromDate || !data.toDate || !data.offerOn || !data.supplier) {
//         return ApiResponse.error("Missing required fields",400)
//       }

//       const newOffer = await Offer.create({
//         fromDate:data.fromDate,
//         toDate:data.toDate,
//         offerOn:data.offerOn,
//         notes:data.notes,
//         supplier:data.supplier
//       });

//       return ApiResponse.success("offer created",{newOffer},201)
//     } catch (error: any) {
//       return ApiResponse.error(`Server error : ${error.message}`,500);
//     }
// }

// export {handler as POST}