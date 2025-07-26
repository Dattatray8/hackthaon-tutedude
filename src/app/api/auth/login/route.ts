import { loginUser } from "@/helpers/server/auth";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";


const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
}
const loginUserRoute = asyncHandler(async(req)=>{
    const data =await req.json();
    console.log('data', data);

    const {user, accessToken, refreshToken} = await loginUser(data.phone,data.password)
    if (!user) {
        return ApiResponse.error("User registration failed", 500);
    }
    const response = ApiResponse.success("User logged in Successfully", { user }, 200)
    response.cookies.set("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24, // 1 day
    });
    response.cookies.set("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, //7 days
    });
    return response; 
})


export {loginUserRoute as POST}