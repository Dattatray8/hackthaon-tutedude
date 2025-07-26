import { registerUser } from "@/helpers/server/auth";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

const registerUserRoute = asyncHandler(async(req)=>{
    const data =await req.json();
    console.log('data', data)
    const user = await registerUser(data);
    if (!user) {
        return ApiResponse.error("User registration failed", 400);
    }
    console.log('user', user)
    return ApiResponse.success("User registered Successfully", { user }, 200)
})


export {registerUserRoute as POST}