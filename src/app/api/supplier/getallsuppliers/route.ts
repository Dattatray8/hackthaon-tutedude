import connectDB from "@/utils/dbConnection";
import User from "@/models/user.model";
import { ApiResponse } from "@/utils/ApiResponse";

const handler = async() => {
    await connectDB();
    try {
        const suppliers = await User.find({ role: "supplier" }).select("-password"); // exclude password

       return ApiResponse.success("Suppliers fetched successfully", { suppliers }, 200);

    } catch (error: any) {
    return ApiResponse.error(`Server error: ${error.message}`, 500);

    }
}

export {handler as GET}