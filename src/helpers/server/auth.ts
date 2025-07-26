import User, { IUser } from "@/models/user.model";
import { ApiError } from "@/utils/ApiError";
import connectDB from "@/utils/dbConnection";


export async function registerUser(userData: IUser) {
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