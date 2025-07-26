import User, { userSchema } from "@/models/user.model";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import connectDB from "@/utils/dbConnection";

async function loginUser(phone:string,password:string){
  await connectDB()
  const isUser = await User.findOne({phone})
  if(!isUser){
    throw new ApiError("user not exists",400)
  }
  let correctUser = await userSchema.methods.isPasswordCorrect(password)
  if(!correctUser){
    throw new ApiError("incorrect password",400)
  }
  return ApiResponse.success("User login successfully",{correctUser},200)
}

const loginUserRoute = asyncHandler(async(req)=>{
    const data =await req.json();
    console.log('data', data);

    const user = await loginUser(data.phone,data.password)
    if (!user) {
        return ApiResponse.error("User registration failed", 400);
    }
    console.log('user', user)
    return ApiResponse.success("User registered Successfully", { user }, 200)
})


export {loginUserRoute as POST}