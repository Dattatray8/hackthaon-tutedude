import User, { IUser, userSchema } from "@/models/user.model";
import { ApiError } from "@/utils/ApiError";
import connectDB from "@/utils/dbConnection";
import { handleError } from "@/utils/handleError";

export default async function generateRefreshAndAccessToken(
  userId: string
): Promise<{ accessToken: string; refreshToken: string }> {
  console.log("Generating tokens for userid ", userId);

  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error while generating tokens", error);
    throw handleError(error);
  }
}
async function registerUser(userData: IUser) {
    // Check if user exists
    const orConditions: Array<Record<string, string>> = [
        { phone: userData.phone },
    ];
    console.log("userData.email", userData.email);
    if (userData.email) {
        orConditions.push({ email: userData.email });
    }
    await connectDB();
    const existingUser = await User.findOne({ $or: orConditions });
    if (existingUser) {
        const credential =
            existingUser?.email && existingUser.email === userData.email
                ? "Email"
                : "Phone";
        throw new ApiError(`User with ${credential} already registered`, 409);
    }

    const newUser: IUser = {
        username: userData.username,
        phone: userData.phone,
        password: userData.password,
        role: userData.role,
        ...(userData.email && { email: userData.email }),
    };

    const userDoc = await User.create(newUser);
    const createdUser = await User.findById(userDoc._id).select("-password");
    if (!createdUser) {
        throw new ApiError("Failed to register user", 500);
    }
    console.log("User registered successfully", createdUser);
    return createdUser;
}

async function loginUser(phone: string, password: string) {
    await connectDB()
    const existingUser = await User.findOne({ phone })
    if (!existingUser) {
        console.log('User not found');   
        throw new ApiError("Invalid credentials", 400)
    }
    const isPasswordCorrect = await existingUser.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        console.log('Incorrect password');
        throw new ApiError("Invalid Credentials", 400)
    }
    const user = await User.findById(existingUser._id).select("-password");
    const {accessToken, refreshToken} = await generateRefreshAndAccessToken(user._id);
    return {user, accessToken, refreshToken};
}
   


async function getUserById(userId: string): Promise<IUser> {
    await connectDB();
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new ApiError("User not found", 404);
    }
    return user;
}
export { registerUser, loginUser, getUserById, generateRefreshAndAccessToken };