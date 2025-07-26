import { RegisterFormData } from "@/components/Register";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { IUser } from "@/models/user.model";
import axios from "axios";

export type HelperResponse<T = unknown> = {
  data: T | null;
  error: {
    message: string;
  } | null;
};

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