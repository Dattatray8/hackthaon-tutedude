import { RegisterFormData } from "@/components/Register";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { HelperResponse } from "@/lib/HelperResponse";
import { IUser } from "@/models/user.model";
import axios from "axios";


 async function registerUser(
  data: RegisterFormData
): Promise<HelperResponse<IUser>> {
  try {
    const response = await axios.post<IUser>("/api/auth/register", data);
    return { data: response.data, error: null };
  } catch (error: unknown) {
    const message = getErrorMessage(error, "An unknown error occurred.");
    return { data: null, error: { message } };
  }
}


export async function loginUser(
data: { phone: string; password: string }
): Promise<HelperResponse<IUser>> {
  try {
    const response = await axios.post<IUser>("/api/auth/login", data);
    return { data: response.data, error: null };
  } catch (error: unknown) {
    const message = getErrorMessage(error, "An unknown error occurred.");
    return { data: null, error: { message } };
  }
}

export {registerUser}

async function getCurrentUser(): Promise<HelperResponse<IUser>> {
  try {
    const response = await axios.get<IUser>("/api/users");
    return { data: response.data, error: null };
  } catch (error: unknown) {
    const message = getErrorMessage(error, "An unknown error occurred.");
    return { data: null, error: { message } };
  }
}

export { getCurrentUser };

export async function logoutUser(): Promise<HelperResponse<null>> {
  try {
    await axios.get("/api/auth/logout");
    return { data: null, error: null };
  } catch (error: unknown) {
    const message = getErrorMessage(error, "An unknown error occurred during logout.");
    return { data: null, error: { message } };
  }
}
