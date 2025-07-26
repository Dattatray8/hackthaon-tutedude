import { registerUser } from "@/helpers/server/auth";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

const registerUserRoute = asyncHandler(async(req)=>{
    const data =await req.json();
    const user = await registerUser(data);
    return ApiResponse.success("User registered Successfully", {user}, 200)
})


export {registerUserRoute as POST}