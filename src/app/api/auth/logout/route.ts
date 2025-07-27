import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

const logoutUserRoute = asyncHandler(async () => {
  const response = ApiResponse.success("User logged out successfully", {}, 200);

  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
});

export { logoutUserRoute as GET };
